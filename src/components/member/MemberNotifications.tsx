import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock } from 'lucide-react';

export function MemberNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Payment Reminder',
      message: 'Your monthly membership fee of ₹2,500 is due on March 15, 2024.',
      date: '2024-03-10',
      isRead: false,
      type: 'payment'
    },
    {
      id: '2',
      title: 'Gym Closure Notice',
      message: 'The gym will be closed on Sunday, March 17th for maintenance work.',
      date: '2024-03-08',
      isRead: true,
      type: 'announcement'
    },
    {
      id: '3',
      title: 'New Supplement Arrival',
      message: 'New protein supplements from MuscleBlaze are now available at our store.',
      date: '2024-03-05',
      isRead: false,
      type: 'promotion'
    },
    {
      id: '4',
      title: 'Diet Plan Updated',
      message: 'Your personalized diet plan has been updated. Please check the details.',
      date: '2024-03-03',
      isRead: true,
      type: 'update'
    }
  ]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, isRead: true })
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💳';
      case 'announcement': return '📢';
      case 'promotion': return '🎉';
      case 'update': return '📝';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'announcement': return 'bg-orange-100 text-orange-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      case 'update': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </CardTitle>
            <CardDescription>Stay updated with gym announcements and reminders</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                !notification.isRead 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-background border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <Badge className={getNotificationColor(notification.type)}>
                        {notification.type}
                      </Badge>
                      {!notification.isRead && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {notification.isRead ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications to display</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}