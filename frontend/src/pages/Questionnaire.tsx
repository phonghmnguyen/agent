import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Dumbbell } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Spinner } from '@/components/ui/spinner'



type WorkoutPreferences = {
    frequency: string
    fitnessGoal: string
    workoutLocation: string
    spaceConstraint: number
    hasEquipment: boolean
    experienceLevel: string
    workoutDuration: number
}

export default function Questionnaire() {
    const [preferences, setPreferences] = useState<WorkoutPreferences>({
        frequency: '',
        fitnessGoal: '',
        workoutLocation: '',
        spaceConstraint: 5,
        hasEquipment: false,
        experienceLevel: '',
        workoutDuration: 30
    })

    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        console.log(preferences)
        try {
            const response = await fetch('http://0.0.0.0:8000/api/routines', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    frequency: preferences.frequency,
                    fitness_goal: preferences.fitnessGoal,
                    workout_location: preferences.workoutLocation,
                    space_constraint: preferences.spaceConstraint,
                    has_equipment: preferences.hasEquipment,
                    experience_level: preferences.experienceLevel,
                    workout_duration: preferences.workoutDuration,
                }),
            })



            const data = await response.json()
            await new Promise((resolve) => setTimeout(resolve, 4000));
            console.log(data)



            toast({
                title: "Success 🚀",
                description: "Your workout routine has been created!",
            })

            navigate("/routine")





        } catch (error) {
            console.error('Error creating routine:', error)
            toast({
                title: "Error",
                description: "Failed to create workout routine. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <Card className="max-w-4xl mx-auto w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                        <Dumbbell className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Workout Preference Questionnaire</CardTitle>
                    <CardDescription>Help us tailor your Neurofit experience by answering a few questions about your workout preferences.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="frequency">How often do you work out?</Label>
                                <Select
                                    value={preferences.frequency}
                                    onValueChange={(value) => setPreferences({ ...preferences, frequency: value })}
                                >
                                    <SelectTrigger id="frequency">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">2-3 times a week</SelectItem>
                                        <SelectItem value="biweekly">Once every two weeks</SelectItem>
                                        <SelectItem value="occasionally">Occasionally</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="workoutLocation">Where do you typically work out?</Label>
                                <Select
                                    value={preferences.workoutLocation}
                                    onValueChange={(value) => setPreferences({ ...preferences, workoutLocation: value })}
                                >
                                    <SelectTrigger id="workoutLocation">
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="home">At home</SelectItem>
                                        <SelectItem value="gym">At the gym</SelectItem>
                                        <SelectItem value="outdoors">Outdoors</SelectItem>
                                        <SelectItem value="mixed">Mixed locations</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>What is your primary fitness goal?</Label>
                            <RadioGroup
                                className="grid grid-cols-2 gap-4"
                                value={preferences.fitnessGoal}
                                onValueChange={(value) => setPreferences({ ...preferences, fitnessGoal: value })}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="staying fit" id="stayingFit" />
                                    <Label htmlFor="stayingFit">Staying Fit</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="muscle gain" id="muscleGain" />
                                    <Label htmlFor="muscleGain">Muscle Gain</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="weight loss" id="weightLoss" />
                                    <Label htmlFor="weightLoss">Weight Loss</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="endurance" id="endurance" />
                                    <Label htmlFor="endurance">Endurance</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <Label>How much space do you have for workouts?</Label>
                            <Slider
                                min={0}
                                max={10}
                                step={1}
                                value={[preferences.spaceConstraint]}
                                onValueChange={([value]) => setPreferences({ ...preferences, spaceConstraint: value })}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Very limited</span>
                                <span>Spacious</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="hasEquipment"
                                checked={preferences.hasEquipment}
                                onCheckedChange={(checked) => setPreferences({ ...preferences, hasEquipment: checked })}
                            />
                            <Label htmlFor="hasEquipment">I have access to workout equipment</Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="experienceLevel">What's your fitness experience level?</Label>
                                <Select
                                    value={preferences.experienceLevel}
                                    onValueChange={(value) => setPreferences({ ...preferences, experienceLevel: value })}
                                >
                                    <SelectTrigger id="experienceLevel">
                                        <SelectValue placeholder="Select experience level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="workoutDuration">Preferred workout duration (minutes)</Label>
                                <Input
                                    id="workoutDuration"
                                    type="number"
                                    min={10}
                                    max={120}
                                    value={preferences.workoutDuration}
                                    onChange={(e) => setPreferences({ ...preferences, workoutDuration: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center items-center p-4">
                        {isLoading ? (
                            <Spinner size="small" className="" >
                                Personalizing Your Workout With ❤️
                            </Spinner>
                        ) : (
                            <Button type="submit" className="w-full">
                                Submit Preferences
                            </Button>)}

                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}