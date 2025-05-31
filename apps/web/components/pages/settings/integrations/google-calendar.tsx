'use client';

import { useState, useEffect } from 'react';

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export default function GoogleCalendarAuth() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<GoogleUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [tokenClient, setTokenClient] = useState<any>(null);
    const [gapiInited, setGapiInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);

    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    const SCOPES = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
    ].join(' ');

    useEffect(() => {
        initializeApis();
    }, []);

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

        console.log('Access token received:', resp);
        setIsSignedIn(true);
        
        // Get user profile info
        try {
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

            await listUpcomingEvents();
        } catch (error) {
            console.error('Failed to get user info:', error);
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

    const signOut = async () => {
        try {
            setIsLoading(true);
            const token = window.gapi.client.getToken();
            
            if (token !== null) {
                window.google.accounts.oauth2.revoke(token.access_token);
                window.gapi.client.setToken('');
            }
            
            setIsSignedIn(false);
            setUser(null);
            setEvents([]);
        } catch (error) {
            console.error('Sign out failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const listUpcomingEvents = async () => {
        try {
            const request = {
                'calendarId': 'primary',
                'timeMin': new Date().toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime',
            };
            
            const response = await window.gapi.client.calendar.events.list(request);
            const events = response.result.items || [];
            setEvents(events);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const createTestEvent = async () => {
        const eventData = {
            summary: 'Test Event from Next.js',
            description: 'Created via Next.js Google Calendar integration',
            start: {
                dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };

        try {
            setIsLoading(true);
            const response = await window.gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: eventData
            });
            
            if (response.status === 200) {
                alert(`Event created successfully! Event ID: ${response.result.id}`);
                await listUpcomingEvents(); // Refresh events list
            }
        } catch (error) {
            console.error('Failed to create event:', error);
            alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading Google Calendar...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Google Calendar Integration</h2>
            
            {!isSignedIn ? (
                <div className="space-y-4">
                    <p className="text-gray-600 text-center">
                        Sign in with Google to manage your calendar events
                    </p>
                    <button
                        onClick={signIn}
                        disabled={isLoading || !tokenClient}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center">
                        {user?.imageUrl && (
                            <img
                                src={user.imageUrl}
                                alt={user.name}
                                className="w-16 h-16 rounded-full mx-auto mb-2"
                            />
                        )}
                        <h3 className="font-medium">{user?.name}</h3>
                        <p className="text-gray-600 text-sm">{user?.email}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={createTestEvent}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            {isLoading ? 'Creating...' : 'Create Test Event'}
                        </button>
                        
                        <button
                            onClick={listUpcomingEvents}
                            disabled={isLoading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Refresh Events
                        </button>
                        
                        <button
                            onClick={signOut}
                            disabled={isLoading}
                            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors md:col-span-2"
                        >
                            Sign Out
                        </button>
                    </div>

                    {events.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {events.map((event) => (
                                    <div key={event.id} className="p-3 border rounded-lg bg-gray-50">
                                        <div className="font-medium">{event.summary}</div>
                                        <div className="text-sm text-gray-600">
                                            {event.start.dateTime 
                                                ? new Date(event.start.dateTime).toLocaleString()
                                                : new Date(event.start.date!).toLocaleDateString()
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}