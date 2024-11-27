
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Dumbbell, Smartphone, Target } from "lucide-react"
import LoginButton from "@/components/LoginButton"

export default function NeuroFitLanding() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 right-0 w-full bg-white/70 backdrop-blur-md shadow-md z-50 transition-colors duration-300">
                <div className="px-4 lg:px-6 h-14 flex items-center justify-between max-w-7xl mx-auto">
                    <a className="flex items-center justify-center" href="/">
                        <Target className="h-6 w-6" />
                        <span className="ml-2 text-2xl font-bold">NeuroFit</span>
                    </a>
                    <nav className="flex gap-4 sm:gap-6">
                        <a className="text-sm font-medium hover:underline underline-offset-4" href="#features">
                            Features
                        </a>
                        <a className="text-sm font-medium hover:underline underline-offset-4" href="#testimonies">
                            Testimonies
                        </a>
                        <a className="text-sm font-medium hover:underline underline-offset-4" href="#about">
                            About
                        </a>
                        <a className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
                            Contact
                        </a>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text animate-gradient font-bold bg-300% tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Feedback. Adapt. Progress.
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Unlock your potential with tailored workouts and real-time feedback to transform your body.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <LoginButton text="Get Started" />
                                <Button variant="outline">Learn More</Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-2 p-6">
                                    <Brain className="h-12 w-12 mb-2 text-primary" />
                                    <h3 className="text-xl font-bold">Video Feedback</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                        Submit your workout videos and receive instant personalized feedback to optimize your performance.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-2 p-6">
                                    <Dumbbell className="h-12 w-12 mb-2 text-primary" />
                                    <h3 className="text-xl font-bold">Adaptive Workouts</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                        Personalized fitness routines that evolve with your progress and goals.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-2 p-6">
                                    <Smartphone className="h-12 w-12 mb-2 text-primary" />
                                    <h3 className="text-xl font-bold">Progress Tracking</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                        Track your progress with insightful stats to keep you motivated and informed.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section id="testimonies" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        "The video feedback feature has been a game-changer for my workouts. Instant insights help me improve!"
                                    </p>
                                    <p className="mt-2 font-semibold">- Alex K.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        "I love the adaptive workouts! They keep evolving with my progress, making every session feel fresh."
                                    </p>
                                    <p className="mt-2 font-semibold">- Sarah M.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        "The progress tracking feature keeps me accountable and motivated. I can see how far I’ve come!"
                                    </p>
                                    <p className="mt-2 font-semibold">- David L.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Transform Your Fitness Journey?</h2>
                                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Join Neurofit today and experience the perfect synergy of physical and mental training.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <LoginButton text="Start Now"></LoginButton>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full py-6 border-t">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Neurofit. All rights reserved.</p>
                        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                            <a className="text-xs hover:underline underline-offset-4" href="/terms">
                                Terms of Service
                            </a>
                            <a className="text-xs hover:underline underline-offset-4" href="/privacy">
                                Privacy
                            </a>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    )
}