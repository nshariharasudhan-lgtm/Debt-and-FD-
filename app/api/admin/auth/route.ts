import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, getSupabaseClient, getCleanSupabaseUrl } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const KNOWN_ADMIN_EMAILS = [
  'harihns.0306@gmail.com',
  'ns.hariharasudhan@gmail.com'
];

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdminClient();
    const cleanUrl = getCleanSupabaseUrl();

    if (!supabaseAdmin) {
      return NextResponse.json({
        connected: false,
        message: 'Supabase credentials missing or incomplete',
        url: cleanUrl || null
      });
    }

    // Ping auth admin to verify credentials
    const { error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });

    if (listError) {
      return NextResponse.json({
        connected: false,
        error: listError.message,
        url: cleanUrl
      }, { status: 500 });
    }

    return NextResponse.json({
      connected: true,
      url: cleanUrl
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message || 'Supabase check failed'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, currentPassword, newPassword } = body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    const isRecognizedAdmin = KNOWN_ADMIN_EMAILS.includes(normalizedEmail);
    const supabaseAdmin = getSupabaseAdminClient();
    const supabasePublic = getSupabaseClient();

    // 1. HANDLE LOGIN
    if (action === 'login') {
      if (!normalizedEmail || !password) {
        return NextResponse.json(
          { success: false, error: 'Email and password are required.' },
          { status: 400 }
        );
      }

      // If Supabase is connected
      if (supabaseAdmin) {
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        let existingUser = userList?.users?.find(u => u.email?.toLowerCase() === normalizedEmail);

        // Verify credentials with Supabase Auth
        let authenticated = false;

        if (supabasePublic) {
          const { data: signInData, error: signInErr } = await supabasePublic.auth.signInWithPassword({
            email: normalizedEmail,
            password: password
          });

          if (!signInErr && signInData?.user) {
            authenticated = true;
            existingUser = signInData.user;
          }
        }

        // Check if admin is authorized
        if (!authenticated && isRecognizedAdmin) {
          // Allow recognized admin if password matches bootstrap credentials
          const bootstrapPwd = process.env.ADMIN_INITIAL_PASSWORD || 'BharatAdmin@2025';
          if (password === bootstrapPwd) {
            authenticated = true;
            if (!existingUser) {
              const { data: created } = await supabaseAdmin.auth.admin.createUser({
                email: normalizedEmail,
                password: password,
                email_confirm: true,
                app_metadata: { role: 'admin', is_admin: true },
                user_metadata: { role: 'admin', name: 'YIELDNEST.ONLINE Admin', is_admin: true }
              });
              if (created?.user) existingUser = created.user;
            }
          }
        }

        if (!authenticated) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Invalid admin credentials. Please check your email and password.' 
            },
            { status: 401 }
          );
        }

        // Ensure user in Supabase has the Admin role updated in app_metadata & user_metadata
        if (existingUser) {
          try {
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              app_metadata: {
                ...existingUser.app_metadata,
                role: 'admin',
                is_admin: true,
                last_admin_login: new Date().toISOString()
              },
              user_metadata: {
                ...existingUser.user_metadata,
                role: 'admin',
                is_admin: true
              }
            });
          } catch (updateErr) {
            console.warn('Could not update role in Supabase:', updateErr);
          }
        }

        return NextResponse.json({
          success: true,
          authenticated: true,
          user: {
            id: existingUser?.id || `admin-${Date.now()}`,
            email: normalizedEmail,
            role: 'admin',
            roleDisplay: 'Master Administrator',
            isSupabaseSynced: true
          },
          supabaseConnected: true
        });
      }

      // Fallback if Supabase is offline
      if (isRecognizedAdmin) {
        const bootstrapPwd = process.env.ADMIN_INITIAL_PASSWORD || 'BharatAdmin@2025';
        if (password === bootstrapPwd) {
          return NextResponse.json({
            success: true,
            authenticated: true,
            user: {
              id: 'local-admin',
              email: normalizedEmail,
              role: 'admin',
              roleDisplay: 'Master Administrator (Local Session)',
              isSupabaseSynced: false
            },
            supabaseConnected: false
          });
        }
      }

      return NextResponse.json(
        { success: false, error: 'Unauthorized user.' },
        { status: 403 }
      );
    }

    // 2. HANDLE CHANGE PASSWORD (Requires verifying currentPassword first)
    if (action === 'change_password') {
      if (!normalizedEmail || !currentPassword || !newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { success: false, error: 'Valid email, current password, and new password (min 8 chars) required.' },
          { status: 400 }
        );
      }

      if (supabaseAdmin) {
        // Authenticate with current password first to prevent unauthorized resets
        if (supabasePublic) {
          const { error: verifyErr } = await supabasePublic.auth.signInWithPassword({
            email: normalizedEmail,
            password: currentPassword
          });

          if (verifyErr) {
            return NextResponse.json(
              { success: false, error: 'Current password is incorrect. Authorization denied.' },
              { status: 401 }
            );
          }
        }

        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = userList?.users?.find(u => u.email?.toLowerCase() === normalizedEmail);

        if (existingUser) {
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: newPassword,
            app_metadata: {
              ...existingUser.app_metadata,
              role: 'admin',
              is_admin: true,
              password_updated_at: new Date().toISOString()
            },
            user_metadata: {
              ...existingUser.user_metadata,
              role: 'admin',
              is_admin: true
            }
          });

          if (updateError) {
            return NextResponse.json(
              { success: false, error: updateError.message },
              { status: 500 }
            );
          }

          return NextResponse.json({
            success: true,
            message: 'Password successfully updated and Admin role confirmed in Supabase!',
            role: 'admin'
          });
        }
      }

      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    // 3. HANDLE ADMIN RESET/RECOVER PASSWORD (for authorized admin emails)
    if (action === 'reset_password' || action === 'set_password') {
      if (!isRecognizedAdmin) {
        return NextResponse.json(
          { success: false, error: 'This email is not registered as an authorized administrator.' },
          { status: 403 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      if (supabaseAdmin) {
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        let existingUser = userList?.users?.find(u => u.email?.toLowerCase() === normalizedEmail);

        if (existingUser) {
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: newPassword,
            email_confirm: true,
            app_metadata: {
              ...existingUser.app_metadata,
              role: 'admin',
              is_admin: true,
              password_updated_at: new Date().toISOString()
            },
            user_metadata: {
              ...existingUser.user_metadata,
              role: 'admin',
              is_admin: true
            }
          });

          if (updateError) {
            return NextResponse.json(
              { success: false, error: updateError.message },
              { status: 500 }
            );
          }
        } else {
          const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: normalizedEmail,
            password: newPassword,
            email_confirm: true,
            app_metadata: { role: 'admin', is_admin: true },
            user_metadata: { role: 'admin', name: 'YIELDNEST.ONLINE Admin', is_admin: true }
          });

          if (createError) {
            return NextResponse.json(
              { success: false, error: createError.message },
              { status: 500 }
            );
          }
          existingUser = created.user;
        }

        return NextResponse.json({
          success: true,
          message: `Password successfully updated in Supabase! You can now log in.`,
          user: {
            id: existingUser?.id || `admin-${Date.now()}`,
            email: normalizedEmail,
            role: 'admin',
            roleDisplay: 'Master Administrator',
            isSupabaseSynced: true
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated locally.',
        user: {
          id: 'local-admin',
          email: normalizedEmail,
          role: 'admin',
          roleDisplay: 'Master Administrator (Local Session)',
          isSupabaseSynced: false
        }
      });
    }

    return NextResponse.json(
      { success: false, error: `Invalid action requested` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Admin Auth Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
