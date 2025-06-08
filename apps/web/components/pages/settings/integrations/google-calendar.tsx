'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { updateGoogleAccessToken, getGoogleAccessToken, fetchUserData } from '@/actions/server/user-profile';
import { createClient } from '@/supabase/client';

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface GoogleCalendarIntegrationProps {
  onBack: () => void;
}

export const GoogleCalendarIntegration = ({ onBack }: GoogleCalendarIntegrationProps) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  useEffect(() => {
    loadCurrentUser();
    initializeApis();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const result = await fetchUserData();
      if (result.success && result.data) {
        setCurrentUserId(result.data.id);
        
        const tokenResult = await getGoogleAccessToken(result.data.id);
        if (tokenResult.success && tokenResult.data) {
          setIsSignedIn(true);
          await loadUserProfile(tokenResult.data.accessToken);
        }
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  };

  const loadUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const userInfo = await response.json();
      
      setUser({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        imageUrl: userInfo.picture
      });
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  };

  const initializeApis = async () => {
    try {
      await Promise.all([
        loadGoogleAPI(),
        loadGoogleIdentityServices()
      ]);
    } catch (error) {
      console.error('Failed to initialize Google APIs:', error);
      setIsLoading(false);
    }
  };

  const loadGoogleAPI = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window.gapi !== 'undefined') {
        gapiLoaded();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => gapiLoaded();
      script.onerror = reject;
      document.head.appendChild(script);

      async function gapiLoaded() {
        window.gapi.load('client', initializeGapiClient);
      }

      async function initializeGapiClient() {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        setGapiInited(true);
        resolve();
      }
    });
  };

  const loadGoogleIdentityServices = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window.google !== 'undefined') {
        gisLoaded();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => gisLoaded();
      script.onerror = reject;
      document.head.appendChild(script);

      function gisLoaded() {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: handleAuthCallback,
        });
        setTokenClient(client);
        setGisInited(true);
        resolve();
      }
    });
  };

  useEffect(() => {
    if (gapiInited && gisInited) {
      setIsLoading(false);
    }
  }, [gapiInited, gisInited]);

  const handleAuthCallback = async (resp: any) => {
    if (resp.error !== undefined) {
      console.error('Auth error:', resp);
      return;
    }

    setIsLoading(true);
    
    try {
   
      await updateGoogleAccessToken( resp.access_token, resp.refresh_token);
     
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${resp.access_token}`
        }
      });
      const userInfo = await response.json();
      
      setUser({
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        imageUrl: userInfo.picture
      });

      setIsSignedIn(true);
    } catch (error) {
      console.error('Failed to save token or get user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    if (!tokenClient) return;
    
    try {
      setIsLoading(true);
      
      if (window.gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsLoading(true);
      const token = window.gapi.client.getToken();
      
      if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token);
        window.gapi.client.setToken('');
      }

      if (currentUserId) {
        await updateGoogleAccessToken( '', '');
      }
      
      setIsSignedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Disconnect failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft size={16} />
          </Button>
          <h3 className="text-xl sm:text-2xl text-neutral-strong">
            Google Calendar
          </h3>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
        </Button>
        <h3 className="text-xl sm:text-2xl text-neutral-strong">
          Google Calendar
        </h3>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 p-4 border border-border-neutral-weaker rounded-lg">
          <Image
            src="/icons/google-calendar.png"
            width={48}
            height={48}
            alt="Google Calendar"
            className="flex-shrink-0"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-neutral-strong">Google Calendar</h4>
            <p className="text-sm text-neutral-muted">
              Connect your Google Calendar to sync events and manage your schedule directly from your inbox.
            </p>
          </div>
          {isSignedIn ? (
            <CheckCircle className="text-green-500" size={24} />
          ) : (
            <Calendar className="text-neutral-muted" size={24} />
          )}
        </div>

        {!isSignedIn ? (
          <div className="space-y-4">
            <div className="p-4 bg-neutral-subtle rounded-lg">
              <h5 className="font-medium mb-2">What you can do:</h5>
              <ul className="text-sm text-neutral-muted space-y-1">
                <li>• Create calendar events from emails</li>
                <li>• View upcoming events in your inbox</li>
                <li>• Automatically schedule meetings</li>
                <li>• Sync availability across platforms</li>
              </ul>
            </div>
            <Button
              onClick={signIn}
              disabled={isLoading || !tokenClient}
              className="w-full"
            >
              {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="font-medium text-green-800">Connected Successfully</span>
              </div>
              {user && (
                <div className="flex items-center gap-3">
                  {user.imageUrl && (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium text-green-800">{user.name}</div>
                    <div className="text-sm text-green-600">{user.email}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={disconnect}
                disabled={isLoading}
                className="flex-1"
              >
                Disconnect
              </Button>
              <Button
                variant="outline"
                onClick={signIn}
                disabled={isLoading}
                className="flex-1"
              >
                Reconnect
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};