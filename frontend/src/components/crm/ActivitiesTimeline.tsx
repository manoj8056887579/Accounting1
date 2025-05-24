
import React, { useState, useMemo } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Check, Clock, Filter, Phone, Mail, MessageSquare, CalendarDays, ListChecks, Search } from 'lucide-react';
import { mockActivities } from '@/data/mockCRM';
import { CRMActivity, ActivityType } from '@/models/crm';
import { format, isBefore, isToday, addDays, parseISO, isAfter } from 'date-fns';
import ActivityForm from './ActivityForm';

const ActivitiesTimeline = () => {
  const [activities, setActivities] = useState<CRMActivity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showAddActivity, setShowAddActivity] = useState(false);

  // Helper function to categorize by date
  const categorizeActivities = useMemo(() => {
    // Apply filters
    const filtered = activities.filter(activity => {
      const matchesSearch = 
        activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
        activity.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.related_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || activity.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
      
      // Date filtering
      const dueDate = parseISO(activity.due_date);
      let matchesDate = true;
      
      if (dateFilter === 'today') {
        matchesDate = isToday(dueDate);
      } else if (dateFilter === 'upcoming') {
        matchesDate = isAfter(dueDate, new Date()) && !isToday(dueDate);
      } else if (dateFilter === 'overdue') {
        matchesDate = isBefore(dueDate, new Date()) && !isToday(dueDate);
      }
      
      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

    // Categorize
    return {
      today: filtered.filter(a => isToday(parseISO(a.due_date))),
      upcoming: filtered.filter(a => isAfter(parseISO(a.due_date), new Date()) && !isToday(parseISO(a.due_date))),
      past: filtered.filter(a => isBefore(parseISO(a.due_date), new Date()) && !isToday(parseISO(a.due_date))),
    };
  }, [activities, searchTerm, typeFilter, statusFilter, dateFilter]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return <Phone className="h-5 w-5 text-blue-500" />;
      case 'email':
        return <Mail className="h-5 w-5 text-green-500" />;
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5 text-emerald-500" />;
      case 'meeting':
        return <CalendarDays className="h-5 w-5 text-violet-500" />;
      case 'task':
        return <ListChecks className="h-5 w-5 text-amber-500" />;
      default:
        return <div className="h-5 w-5 bg-gray-200 rounded-full" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  const handleActivityAdded = (newActivity: CRMActivity) => {
    setActivities([newActivity, ...activities]);
    setShowAddActivity(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Activities</CardTitle>
            <CardDescription>Activities due today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500 mr-2" />
              <div className="text-3xl font-bold">{categorizeActivities.today.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming</CardTitle>
            <CardDescription>Future scheduled activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500 mr-2" />
              <div className="text-3xl font-bold">{categorizeActivities.upcoming.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
            <CardDescription>Recently completed activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-500 mr-2" />
              <div className="text-3xl font-bold">
                {activities.filter(a => a.status === 'completed').length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setStatusFilter('all');
              setDateFilter('all');
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={() => setShowAddActivity(true)}>
          Add Activity
        </Button>
      </div>
      
      {/* Activities Timeline */}
      <div className="space-y-6">
        {/* Today's Activities */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Today</h3>
          {categorizeActivities.today.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No activities scheduled for today
              </CardContent>
            </Card>
          ) : (
            categorizeActivities.today.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <div className={`h-1 ${
                  activity.status === 'completed' ? 'bg-green-500' : 
                  activity.status === 'scheduled' ? 'bg-blue-500' : 'bg-amber-500'
                }`} />
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.subject}</h4>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="inline-block w-2 h-2 rounded-full mr-1 bg-blue-500"></span>
                          <span className="mr-2">
                            {activity.related_type === 'customer' ? 'Customer' : 'Vendor'}:
                          </span>
                          <span className="font-medium">{activity.related_name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assigned to: {activity.assigned_to_name}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Upcoming Activities */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Upcoming</h3>
          {categorizeActivities.upcoming.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No upcoming activities scheduled
              </CardContent>
            </Card>
          ) : (
            categorizeActivities.upcoming.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <div className="h-1 bg-blue-500" />
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.subject}</h4>
                        <div className="text-sm text-muted-foreground">
                          Due: {formatDate(activity.due_date)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="inline-block w-2 h-2 rounded-full mr-1 bg-blue-500"></span>
                          <span className="mr-2">
                            {activity.related_type === 'customer' ? 'Customer' : 'Vendor'}:
                          </span>
                          <span className="font-medium">{activity.related_name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assigned to: {activity.assigned_to_name}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Past Activities */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Past Activities</h3>
          {categorizeActivities.past.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No past activities found
              </CardContent>
            </Card>
          ) : (
            categorizeActivities.past.map((activity) => (
              <Card key={activity.id} className="overflow-hidden opacity-80">
                <div className={`h-1 ${
                  activity.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.subject}</h4>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.status === 'completed' ? 'Completed' : 'Overdue'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="inline-block w-2 h-2 rounded-full mr-1 bg-blue-500"></span>
                          <span className="mr-2">
                            {activity.related_type === 'customer' ? 'Customer' : 'Vendor'}:
                          </span>
                          <span className="font-medium">{activity.related_name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {formatDate(activity.due_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {showAddActivity && (
        <ActivityForm 
          relatedId=""
          relatedName=""
          relatedType="customer"
          onClose={() => setShowAddActivity(false)}
          onActivityAdded={() => {
            setShowAddActivity(false);
            // In a real app, we would refresh the activities list here
          }}
        />
      )}
    </div>
  );
};

export default ActivitiesTimeline;
