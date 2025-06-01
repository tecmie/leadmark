"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MessageCircle,
  Users,
  MoreHorizontal,
  ExternalLink,
  Send,
  UserPlus,
  Clock,
} from "lucide-react";
import { fetchContacts } from "@/actions/server/contacts";
import { useRouter } from "next/navigation";
import { routes } from "@/utils/routes";
import { toast } from "sonner";

interface Contact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  last_contacted?: string;
  message_count: number;
  latest_message?: string;
  thread_count: number;
}

export function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'activity'>('recent');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [createContactDialogOpen, setCreateContactDialogOpen] = useState(false);
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactFirstName, setNewContactFirstName] = useState("");
  const [newContactLastName, setNewContactLastName] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    // Filter and sort contacts
    let filtered = contacts.filter(
      (contact) =>
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${contact.first_name || ""} ${contact.last_name || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    // Sort contacts based on selected criteria
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (getDisplayName(a) || '').localeCompare(getDisplayName(b) || '');
        case 'recent':
          const aDate = a.last_contacted ? new Date(a.last_contacted).getTime() : 0;
          const bDate = b.last_contacted ? new Date(b.last_contacted).getTime() : 0;
          return bDate - aDate;
        case 'activity':
          return (b.message_count + b.thread_count) - (a.message_count + a.thread_count);
        default:
          return 0;
      }
    });

    setFilteredContacts(filtered);
  }, [contacts, searchQuery, sortBy]);

  const loadContacts = async () => {
    try {
      const result = await fetchContacts();
      if (result.success) {
        setContacts(result.data || []);
      } else {
        setError(result.message || "Failed to load contacts");
      }
    } catch {
      setError("Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = (contact: Contact) => {
    const fullName = `${contact.first_name || ""} ${contact.last_name || ""}`
      .trim();
    return fullName || contact.email.split("@")[0];
  };

  const getInitials = (contact: Contact) => {
    const firstName = contact.first_name || contact.email.charAt(0);
    const lastName = contact.last_name || contact.email.charAt(1);
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getContactInsights = (contact: Contact) => {
    const insights = [];
    
    if (contact.message_count === 0) {
      insights.push({
        type: 'new',
        label: 'New contact',
        description: 'No messages yet',
        priority: 'high',
        action: { label: 'Send first message', handler: () => handleSendMessage(contact) }
      });
    } else {
      const lastContactedDays = contact.last_contacted
        ? Math.floor((Date.now() - new Date(contact.last_contacted).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      if (lastContactedDays && lastContactedDays > 30) {
        insights.push({
          type: 'stale',
          label: 'Needs follow-up',
          description: `Last contact ${lastContactedDays} days ago`,
          priority: 'high',
          action: { label: 'Follow up', handler: () => handleSendMessage(contact) }
        });
      } else if (lastContactedDays && lastContactedDays > 7) {
        insights.push({
          type: 'moderate',
          label: 'Check in soon',
          description: `Last contact ${lastContactedDays} days ago`,
          priority: 'medium',
          action: { label: 'Send message', handler: () => handleSendMessage(contact) }
        });
      } else if (contact.message_count > 10) {
        insights.push({
          type: 'active',
          label: 'Active contact',
          description: `${contact.message_count} messages exchanged`,
          priority: 'low',
          action: { label: 'View history', handler: () => handleViewConversations(contact) }
        });
      }
    }

    return insights[0] || null;
  };

  const handleCreateContact = () => {
    setCreateContactDialogOpen(true);
    setNewContactEmail("");
    setNewContactFirstName("");
    setNewContactLastName("");
  };

  const handleSaveContact = async () => {
    if (!newContactEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Here you would implement the create contact functionality
    // For now, just show a success message
    // TODO: Implement actual contact creation
    toast.success(`Contact ${newContactFirstName || newContactEmail} will be added`);
    setCreateContactDialogOpen(false);
  };

  const handleSendMessage = (contact: Contact) => {
    // Navigate to compose with pre-filled recipient
    toast.info("Redirecting to compose message...");
    // This would integrate with your email composition flow
  };

  const handleViewConversations = (contact: Contact) => {
    // Navigate to inbox filtered by this contact
    router.push(`${routes.INBOX_OVERVIEW}?contact=${contact.email}`);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setContactDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 px-12 pt-8">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your contacts and see communication insights
          </p>
        </div>
        <Button onClick={handleCreateContact} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">
                  {contacts.filter((c) => c.thread_count > 0).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sort Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={sortBy === 'recent' ? 'default' : 'outline'}
          onClick={() => setSortBy('recent')}
          size="sm"
        >
          <Clock className="mr-2 h-4 w-4" />
          Recent
        </Button>
        <Button
          variant={sortBy === 'name' ? 'default' : 'outline'}
          onClick={() => setSortBy('name')}
          size="sm"
        >
          Name
        </Button>
        <Button
          variant={sortBy === 'activity' ? 'default' : 'outline'}
          onClick={() => setSortBy('activity')}
          size="sm"
        >
          Activity
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && filteredContacts.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery ? "No contacts found" : "No contacts yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Your contacts will appear here as you receive messages"}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateContact} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Your First Contact
            </Button>
          )}
        </div>
      )}

      {/* Contacts Table */}
      {filteredContacts.length > 0 && (
        <Card className="py-2">
          <div className="rounded-md ">
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="h-12 px-6 font-medium pl-20">Contact Information</TableHead>
                  <TableHead className="hidden md:table-cell h-12 px-6 font-medium text-center">Messages</TableHead>
                  <TableHead className="hidden lg:table-cell h-12 px-6 font-medium text-center">Conversations</TableHead>
                  <TableHead className="hidden lg:table-cell h-12 px-6 font-medium">Last Contact</TableHead>
                  <TableHead className="w-[100px] h-12 px-6 font-medium text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => {
                  return (
                    <TableRow
                      key={contact.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors border-none "
                      onClick={() => handleViewContact(contact)}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <span className="text-sm font-medium text-primary">
                              {getInitials(contact)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-foreground">
                              {getDisplayName(contact)}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {contact.email}
                            </div>
                            {contact.latest_message && (
                              <div className="text-xs text-muted-foreground mt-1 truncate max-w-[250px] md:max-w-[350px]">
                                "{contact.latest_message}"
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell px-6 py-4 text-center">
                        <div className="font-medium text-foreground">{contact.message_count}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-6 py-4 text-center">
                        <div className="font-medium text-foreground">{contact.thread_count}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell px-6 py-4">
                        <div className="text-sm text-muted-foreground">
                          {contact.last_contacted ? formatDate(contact.last_contacted) : 'Never'}
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-6 py-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-muted"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendMessage(contact);
                              }}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            {contact.thread_count > 0 && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewConversations(contact);
                                }}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Conversations
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Edit Contact
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Contact Detail Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              View and manage contact information
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-semibold text-primary">
                    {getInitials(selectedContact)}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    {getDisplayName(selectedContact)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedContact.email}
                  </p>
                  <Badge variant="outline">
                    {selectedContact.thread_count > 0 ? "Active" : "New"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg  p-3 text-center">
                  <div className="text-2xl font-bold">
                    {selectedContact.message_count}
                  </div>
                  <div className="text-xs text-muted-foreground">Messages</div>
                </div>
                <div className="rounded-lg  p-3 text-center">
                  <div className="text-2xl font-bold">
                    {selectedContact.thread_count}
                  </div>
                  <div className="text-xs text-muted-foreground">Conversations</div>
                </div>
              </div>

              {selectedContact.latest_message && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Latest Message</h4>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      "{selectedContact.latest_message}"
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">First Contact</span>
                  <span>{formatDate(selectedContact.created_at)}</span>
                </div>
                {selectedContact.last_contacted && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Contact</span>
                    <span>{formatDate(selectedContact.last_contacted)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedContact) {
                  handleSendMessage(selectedContact);
                  setContactDialogOpen(false);
                }
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Contact Dialog */}
      <Dialog open={createContactDialogOpen} onOpenChange={setCreateContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Create a new contact entry
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                placeholder="email@example.com"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                type="email"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  placeholder="John"
                  value={newContactFirstName}
                  onChange={(e) => setNewContactFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  placeholder="Doe"
                  value={newContactLastName}
                  onChange={(e) => setNewContactLastName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}