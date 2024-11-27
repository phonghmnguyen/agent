import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dumbbell, Clock, Calendar, Play, TrendingUp, Flame, Award, Target, MessageSquare, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import StatCard from '@/components/StatCard'
import LogoutButton from '@/components/LogoutButton'
import Confetti from 'react-confetti'

const workoutRoutine = {
    weeklyPlan: [
        {
            day: "Monday",
            focus: "Upper Body",
            exercises: [
                { name: "Push-ups", sets: 3, reps: 12, videoUrl: "https://example.com/pushups-video", caloriesBurn: 48 },
                { name: "Dumbbell Rows", sets: 3, reps: 10, videoUrl: "https://example.com/dumbbell-rows-video", caloriesBurn: 60 },
                { name: "Shoulder Press", sets: 3, reps: 10, videoUrl: "https://example.com/shoulder-press-video", caloriesBurn: 54 },
                { name: "Bicep Curls", sets: 3, reps: 12, videoUrl: "https://example.com/bicep-curls-video", caloriesBurn: 36 },
            ],
            caloriesBurned: 300,
        },
        {
            day: "Wednesday",
            focus: "Lower Body",
            exercises: [
                { name: "Squats", sets: 3, reps: 15, videoUrl: "https://example.com/squats-video", caloriesBurn: 90 },
                { name: "Lunges", sets: 3, reps: 10, videoUrl: "https://example.com/lunges-video", caloriesBurn: 60 },
                { name: "Calf Raises", sets: 3, reps: 20, videoUrl: "https://example.com/calf-raises-video", caloriesBurn: 30 },
                { name: "Glute Bridges", sets: 3, reps: 12, videoUrl: "https://example.com/glute-bridges-video", caloriesBurn: 36 },
            ],
            caloriesBurned: 350,
        },
        {
            day: "Friday",
            focus: "Full Body",
            exercises: [
                { name: "Burpees", sets: 3, reps: 10, videoUrl: "https://example.com/burpees-video", caloriesBurn: 100 },
                { name: "Mountain Climbers", sets: 3, reps: 20, videoUrl: "https://example.com/mountain-climbers-video", caloriesBurn: 60 },
                { name: "Plank", sets: 3, duration: "30 seconds", videoUrl: "https://example.com/plank-video", caloriesBurn: 30 },
                { name: "Jump Rope", sets: 3, duration: "1 minute", videoUrl: "https://example.com/jump-rope-video", caloriesBurn: 60 },
            ],
            caloriesBurned: 400,
        },
        {
            day: "Saturday",
            focus: "Full Body",
            exercises: [
                { name: "Burpees", sets: 3, reps: 10, videoUrl: "https://example.com/burpees-video", caloriesBurn: 100 },
                { name: "Mountain Climbers", sets: 3, reps: 20, videoUrl: "https://example.com/mountain-climbers-video", caloriesBurn: 60 },
                { name: "Plank", sets: 3, duration: "30 seconds", videoUrl: "https://example.com/plank-video", caloriesBurn: 30 },
                { name: "Jump Rope", sets: 3, duration: "1 minute", videoUrl: "https://example.com/jump-rope-video", caloriesBurn: 60 },
            ],
            caloriesBurned: 400,
        },
        {
            day: "Sunday",
            focus: "Full Body",
            exercises: [
                { name: "Burpees", sets: 3, reps: 10, videoUrl: "https://example.com/burpees-video", caloriesBurn: 100 },
                { name: "Mountain Climbers", sets: 3, reps: 20, videoUrl: "https://example.com/mountain-climbers-video", caloriesBurn: 60 },
                { name: "Plank", sets: 3, duration: "30 seconds", videoUrl: "https://example.com/plank-video", caloriesBurn: 30 },
                { name: "Jump Rope", sets: 3, duration: "1 minute", videoUrl: "https://example.com/jump-rope-video", caloriesBurn: 60 },
            ],
            caloriesBurned: 400,
        },

    ],
    progress: 65,
    caloriesBurned: 1050,
    workoutsCompleted: 12,
    streakDays: 21,
    personalBests: [
        { exercise: "Push-ups", value: 30, date: "2023-06-15" },
        { exercise: "Squats", value: 50, date: "2023-06-18" },
        { exercise: "Plank", value: "2 minutes", date: "2023-06-20" },
        { exercise: "Jump Rope", value: "5 minutes", date: "2023-06-22" },
        { exercise: "Burpees", value: 20, date: "2023-06-25" },
    ],
    muscleGroups: {
        arms: 30,
        legs: 40,
        core: 20,
        back: 10,
    },
    fitnessScore: 720,
}

const userProfile = {
    name: "Alex Johnson",
    avatar: "/placeholder.svg",
    level: 7,
    xp: 2800,
    xpToNextLevel: 3000,
    fitnessGoal: "Build Muscle",
    preferredWorkoutDuration: 45,
    achievements: [
        { name: "Early Bird", description: "Completed 5 workouts before 8 AM", icon: "🌅" },
        { name: "Consistency King", description: "Maintained a 30-day workout streak", icon: "👑" },
        { name: "Muscle Maven", description: "Lifted 1000 lbs total in a single workout", icon: "💪" },
    ],
}

export default function WorkoutRoutine() {
    const [activeDay, setActiveDay] = useState(workoutRoutine.weeklyPlan[0].day.toLowerCase())
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [workoutStarted, setWorkoutStarted] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const { toast } = useToast()

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            setChatMessages([...chatMessages, { role: 'user', content: inputMessage }])
            // Here you would typically send the message to your AI service and get a response
            // For now, we'll just simulate an AI response
            setTimeout(() => {
                setChatMessages(prev => [...prev, { role: 'ai', content: "I'm your AI fitness assistant. How can I help you customize your workout today?" }])
            }, 1000)
            setInputMessage('')
        }
    }

    const handleStartWorkout = () => {
        setWorkoutStarted(true)
    }

    const handleFinishWorkout = useCallback((day: string) => {
        setWorkoutStarted(false)
        toast({
            title: "Congrats 🥳",
            description: `You have completed your workout for ${day}.`,
        })
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 6000)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            {showConfetti && <Confetti />}
            <div className="w-full max-w-4xl">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">Your Neurofit Journey</CardTitle>
                        <CardDescription className="text-center">Personalized workout routine and progress tracker</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <StatCard
                                icon={Flame}
                                title="Calories Burned"
                                value={workoutRoutine.caloriesBurned}
                                detail={
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Calorie Breakdown</h3>
                                        {workoutRoutine.weeklyPlan.map(day => (
                                            <div key={day.day} className="flex justify-between items-center">
                                                <span>{day.day}</span>
                                                <span>{day.caloriesBurned} cal</span>
                                            </div>
                                        ))}
                                        <h3 className="font-semibold mt-4">Top Calorie-Burning Exercises</h3>
                                        {workoutRoutine.weeklyPlan.flatMap(day => day.exercises)
                                            .sort((a, b) => b.caloriesBurn - a.caloriesBurn)
                                            .slice(0, 3)
                                            .map(exercise => (
                                                <div key={exercise.name} className="flex justify-between items-center">
                                                    <span>{exercise.name}</span>
                                                    <span>{exercise.caloriesBurn} cal</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                            />
                            <StatCard
                                icon={Calendar}
                                title="Workouts Completed"
                                value={workoutRoutine.workoutsCompleted}
                                detail={
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Workout History</h3>
                                        <div className="grid grid-cols-7 gap-2">
                                            {Array.from({ length: 28 }, (_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i < workoutRoutine.workoutsCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm mt-2">You've completed {workoutRoutine.workoutsCompleted} workouts in the last 28 days. Keep up the great work!</p>
                                    </div>
                                }
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Day Streak"
                                value={workoutRoutine.streakDays}
                                detail={
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Your Workout Streak</h3>
                                        <div className="flex items-center space-x-2">
                                            <Flame className="text-orange-500" />
                                            <span className="text-2xl font-bold">{workoutRoutine.streakDays} days</span>
                                        </div>
                                        <p className="text-sm">You're on fire! You've worked out consistently for {workoutRoutine.streakDays} days in a row.</p>
                                        <h3 className="font-semibold mt-4">Streak Milestones</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span>30 days</span>
                                                <Badge variant={workoutRoutine.streakDays >= 30 ? "default" : "secondary"}>
                                                    {workoutRoutine.streakDays >= 30 ? "Achieved" : "Upcoming"}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>60 days</span>
                                                <Badge variant={workoutRoutine.streakDays >= 60 ? "default" : "secondary"}>
                                                    {workoutRoutine.streakDays >= 60 ? "Achieved" : "Upcoming"}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>90 days</span>
                                                <Badge variant={workoutRoutine.streakDays >= 90 ? "default" : "secondary"}>
                                                    {workoutRoutine.streakDays >= 90 ? "Achieved" : "Upcoming"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                }
                            />
                            <StatCard
                                icon={Award}
                                title="Personal Bests"
                                value={workoutRoutine.personalBests.length}
                                detail={
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Your Personal Records</h3>
                                        {workoutRoutine.personalBests.map((pb, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span>{pb.exercise}</span>
                                                <div className="text-right">
                                                    <span className="font-semibold">{pb.value}</span>
                                                    <span className="text-xs text-gray-500 block">{pb.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                        <p className="text-sm mt-2">Keep pushing your limits and setting new records!</p>
                                    </div>
                                }
                            />
                        </div>

                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-xl">User Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4 mb-4">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                                        <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                                        <p className="text-muted-foreground">Level {userProfile.level} Fitness Enthusiast</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">XP Progress</p>
                                        <p className="font-semibold">{userProfile.xp} / {userProfile.xpToNextLevel} XP</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(userProfile.xp / userProfile.xpToNextLevel) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fitness Goal</p>
                                        <p className="font-semibold flex items-center">
                                            <Target className="w-4 h-4 mr-1" />
                                            {userProfile.fitnessGoal}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Preferred Workout Duration</p>
                                        <p className="font-semibold flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {userProfile.preferredWorkoutDuration} minutes
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Workouts</p>
                                        <p className="font-semibold flex items-center">
                                            <Dumbbell className="w-4 h-4 mr-1" />
                                            {workoutRoutine.workoutsCompleted}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Achievements</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {userProfile.achievements.map((achievement, index) => (
                                            <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                                <span className="text-2xl">{achievement.icon}</span>
                                                <div>
                                                    <p className="font-semibold">{achievement.name}</p>
                                                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                                </div>
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Weekly Workout Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
                                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                                        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
                                            {workoutRoutine.weeklyPlan.map((day) => (
                                                <TabsTrigger
                                                    key={day.day}
                                                    value={day.day.toLowerCase()}
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                                >
                                                    {day.day}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </ScrollArea>
                                    {workoutRoutine.weeklyPlan.map((day) => (
                                        <TabsContent key={day.day} value={day.day.toLowerCase()}>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-2xl">{day.day} - {day.focus}</CardTitle>
                                                    <CardDescription>Estimated calorie burn: {day.caloriesBurned}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                                                        <div className="space-y-4">
                                                            {day.exercises.map((exercise, index) => (
                                                                <div key={index} className="flex items-center justify-between border-b pb-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Dumbbell className="w-5 h-5" />
                                                                        <span className="font-medium">{exercise.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Checkbox disabled={!workoutStarted} />
                                                                        <Badge variant="secondary">
                                                                            {exercise.sets} sets
                                                                        </Badge>
                                                                        <Badge variant="secondary">
                                                                            {exercise.reps ? `${exercise.reps} reps` : exercise.duration}
                                                                        </Badge>
                                                                        <Sheet>
                                                                            <SheetTrigger asChild>
                                                                                <Button variant="outline" size="icon">
                                                                                    <Play className="h-4 w-4" />
                                                                                </Button>
                                                                            </SheetTrigger>
                                                                            <SheetContent side="left" className="w-[100%] sm:w-[540px] sm:max-w-none">
                                                                                <SheetHeader>
                                                                                    <SheetTitle>{exercise.name} Demonstration</SheetTitle>
                                                                                </SheetHeader>
                                                                                <div className="mt-4 aspect-video">
                                                                                    <video
                                                                                        controls
                                                                                        className="w-full h-full rounded-lg"
                                                                                        src={exercise.videoUrl}
                                                                                    >
                                                                                        Your browser does not support the video tag.
                                                                                    </video>
                                                                                </div>
                                                                            </SheetContent>
                                                                        </Sheet>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </CardContent>
                                                <CardFooter>
                                                    {!workoutStarted ? (
                                                        <Button className="w-full" onClick={handleStartWorkout}>
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Start {day.day} Workout
                                                        </Button>
                                                    ) : (
                                                        <Button className="w-full" onClick={() => handleFinishWorkout(day.day)}>
                                                            <Dumbbell className="w-4 h-4 mr-2" />
                                                            Finish Workout
                                                        </Button>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
                <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                    <SheetTrigger asChild>
                        <Button
                            className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg"
                            size="icon"
                        >
                            <MessageSquare className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                            <SheetTitle>Chat with AI Fitness Assistant</SheetTitle>
                            <SheetDescription>
                                Ask questions or request changes to your workout routine
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col h-[calc(100vh-8rem)]">
                            <ScrollArea className="flex-grow mt-4 border rounded-md p-4 h-[300px]">
                                <div className="space-y-4">
                                    {chatMessages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-2 ${message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <div className="flex items-center mt-4">
                                <Input
                                    placeholder="Type your message..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-grow"
                                />
                                <Button onClick={handleSendMessage} className="ml-2" size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex justify-center mt-6">
                    <LogoutButton text="Sign Out" />
                </div>
            </div>
        </div>
    )
}

