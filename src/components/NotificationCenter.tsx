
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, Package, Clock, TrendingDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const notifications = [
    {
      id: 1,
      type: 'urgent',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      title: 'Urgent: Products Expiring Today',
      message: 'S003 has 5 products expiring today',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'warning',
      icon: <Package className="w-4 h-4 text-orange-500" />,
      title: 'Low Stock Alert',
      message: 'S001 has 12 items below minimum stock',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'info',
      icon: <Clock className="w-4 h-4 text-blue-500" />,
      title: 'Transfer Pending Approval',
      message: '3 transfers awaiting your approval',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'warning',
      icon: <TrendingDown className="w-4 h-4 text-yellow-500" />,
      title: 'Sales Performance Alert',
      message: 'S015 sales down 15% this week',
      time: '2 hours ago'
    }
  ];

  const unreadCount = notifications.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Notifications</span>
              <Badge variant="outline">{unreadCount} new</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full" size="sm">
                View All Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
