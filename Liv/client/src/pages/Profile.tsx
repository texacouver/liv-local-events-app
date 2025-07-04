import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PreferencesSetup } from "@/components/PreferencesSetup";
import { MapPin, Star, Settings, Bell, Shield, HelpCircle, LogOut } from "lucide-react";

export function Profile() {
  // Mock user data
  const userData = {
    name: "Alex Chen",
    email: "alex.chen@email.com",
    location: "Vancouver, BC",
    memberSince: "January 2024",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    stats: {
      favorites: 23,
      dealsUsed: 47,
      pointsEarned: 1250
    }
  };

  // Mock achievements data
  const achievements = [
    {
      title: "Explorer",
      description: "Visited 5 venues",
      icon: "🗺️",
      unlocked: true
    },
    {
      title: "Foodie",
      description: "Tried 10 restaurants",
      icon: "🍽️",
      unlocked: true
    },
    {
      title: "Deal Hunter",
      description: "Used 20 deals",
      icon: "💰",
      unlocked: true
    },
    {
      title: "Night Owl",
      description: "Attend 5 events",
      icon: "🦉",
      unlocked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-green-900/20">
      <div className="container mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Header */}
        <Card className="card-gradient border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userData.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{userData.location}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 dark:text-purple-300">
                Member since {userData.memberSince}
              </Badge>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userData.stats.dealsUsed}</div>
                <div className="text-xs text-muted-foreground">Deals Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-restaurant">{userData.stats.favorites}</div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-retail">{userData.stats.pointsEarned}</div>
                <div className="text-xs text-muted-foreground">Points Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Achievements */}
            <Card className="card-gradient border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-xl border text-center ${
                        achievement.unlocked 
                          ? 'bg-primary/10 border-primary/20' 
                          : 'bg-muted/20 border-muted/40'
                      }`}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className={`text-xs font-semibold ${
                        achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesSetup showTitle={false} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Settings */}
            <Card className="card-gradient border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-muted-foreground">Get alerts about new deals</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Privacy Settings</div>
                        <div className="text-sm text-muted-foreground">Control your data sharing</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <div className="space-y-3">
              <Button 
                className="w-full justify-start text-muted-foreground hover:bg-muted/50 border-0 p-4 h-auto"
                variant="outline"
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Feedback & Support</div>
                  <div className="text-sm text-muted-foreground hover:text-muted-foreground">Help us improve Liv</div>
                </div>
              </Button>
              
              <Button 
                className="w-full justify-start text-red-500 hover:bg-red-500/10 border-0 p-4 h-auto"
                variant="outline"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Sign Out</div>
                  <div className="text-sm text-muted-foreground">Log out of your account</div>
                </div>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavigation />
    </div>
  );
}