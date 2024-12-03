import { useState, useCallback, useEffect } from 'react'
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
import LogoutButton from '@/components/LogoutButton'
import Confetti from 'react-confetti'
import { useAuth0 } from "@auth0/auth0-react";

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

type Exercise = {
    exercise_name: string;
    day: string;
    duration: number; // Duration in seconds
    repetitions: number;
    sets: number;
    notes: string;
};

type ExercisesByDay = {
    day: string;
    exercises: Exercise[];
}[];

type Workout = {
    id: string;
    user_id: string;
    estimated_duration: number; // Estimated duration in minutes
    exercises: Exercise[];
    target_muscle_groups: string[];
    total_calories_burned: number;
    exercise_by_day: ExercisesByDay
};


export default function WorkoutRoutine() {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [activeDay, setActiveDay] = useState(workoutRoutine.weeklyPlan[0].day.toLowerCase())
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [workoutStarted, setWorkoutStarted] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const fetchWorkoutRoutine = async () => {
            try {
                if (!isAuthenticated || !user) return;

                // Fetch access token
                const token = await getAccessTokenSilently();
                console.log("FETCHING")
                console.log(token)

                // Make API call with fetch
                const response = await fetch('http://0.0.0.0:8000/api/workouts/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });



                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(response)
                const body = await response.json();
                const data = body["message"]
                console.log(data)

                const exercises: Exercise[] = data.exercises.map((exercise: any) => ({
                    exercise_name: exercise.exercise_name,
                    day: exercise.day,
                    duration: exercise.duration,
                    repetitions: exercise.repetitions,
                    sets: exercise.sets,
                    notes: exercise.notes,
                }));

                // Group exercises by day into an array of objects
                const uniqueDays = Array.from(new Set(exercises.map((exercise) => exercise.day)));

                const exercisesByDay = uniqueDays.map((day) => {
                    const dayExercises = exercises.filter((exercise) => exercise.day === day);
                    return { day, exercises: dayExercises };
                });

                // Set workout routine state
                const workout: Workout = {
                    id: data.id,
                    user_id: data.user_id,
                    estimated_duration: data.estimated_duration,
                    exercises: exercises,
                    exercise_by_day: exercisesByDay,
                    target_muscle_groups: data.target_muscle_groups,
                    total_calories_burned: data.total_calories_burned,
                };
                setWorkout(workout);
                console.log(workout)

            } catch (error: any) {
                console.error('Failed to fetch workout routine:', error);
                toast({
                    title: 'Error fetching workout routine',
                    description: error.message || 'Something went wrong',
                });
            }
        };

        fetchWorkoutRoutine();
    }, [isAuthenticated, user, getAccessTokenSilently, toast]);


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
                        <CardTitle className="text-3xl font-bold text-center">Your Fitness101 Journey</CardTitle>
                        <CardDescription className="text-center">Personalized workout with AI fitness assistant</CardDescription>
                    </CardHeader>
                    <CardContent>

                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-xl">User Profile</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4 mb-4">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage src={user?.picture} alt={userProfile.name} />
                                        <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-2xl font-bold">{user?.name}</h2>
                                        <p className="text-muted-foreground">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Workout Plan</p>
                                        <p className="font-semibold flex items-center">
                                            <Dumbbell className="w-4 h-4 mr-1" />
                                            {workout?.exercises.length} exercises over {workout?.exercise_by_day.length} days
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Target Muscle Groups</p>
                                        <p className="font-semibold flex items-center">
                                            <Target className="w-4 h-4 mr-1" />
                                            {workout?.target_muscle_groups.join(", ")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Preferred Workout Duration</p>
                                        <p className="font-semibold flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {workout?.estimated_duration} minutes
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Estimated Calories Burn</p>
                                        <p className="font-semibold flex items-center">
                                            <Dumbbell className="w-4 h-4 mr-1" />
                                            {workout?.total_calories_burned}
                                        </p>
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
                                            {workout?.exercise_by_day.map((day) => (
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
                                    {workout?.exercise_by_day.map((day) => (
                                        <TabsContent key={day.day} value={day.day.toLowerCase()}>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-2xl">{day.day}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                                                        <div className="space-y-4">
                                                            {day.exercises.map((exercise, index) => (
                                                                <div key={index} className="flex items-center justify-between border-b pb-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Dumbbell className="w-5 h-5" />
                                                                        <span className="font-medium">{exercise.exercise_name}</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Checkbox disabled={!workoutStarted} />
                                                                        <Badge variant="secondary">
                                                                            {exercise.sets} sets
                                                                        </Badge>
                                                                        <Badge variant="secondary">
                                                                            {exercise.repetitions ? `${exercise.repetitions} reps` : exercise.duration}
                                                                        </Badge>
                                                                        <Sheet>
                                                                            <SheetTrigger asChild>
                                                                                <Button variant="outline" size="icon">
                                                                                    <Play className="h-4 w-4" />
                                                                                </Button>
                                                                            </SheetTrigger>
                                                                            <SheetContent side="left" className="w-[100%] sm:w-[540px] sm:max-w-none">
                                                                                <SheetHeader>
                                                                                    <SheetTitle>{exercise.exercise_name} Demonstration</SheetTitle>
                                                                                </SheetHeader>

                                                                                <div className="mt-4 aspect-video">
                                                                                    <iframe
                                                                                        className="w-full h-full rounded-lg"
                                                                                        src="https://www.youtube.com/embed/0BjlBnfHcHM?si=_aGHwgYtNuYjgZa2"
                                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                        allowFullScreen
                                                                                    ></iframe>
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
