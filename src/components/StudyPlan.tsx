
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Download, Share2, RefreshCw, Clock, Cpu } from 'lucide-react';
import { useStudyContext, DifficultyLevel } from '@/context/StudyContext';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const StudyPlan: React.FC = () => {
  const navigate = useNavigate();
  const { 
    studyPlan, 
    subjects, 
    timeSlots, 
    goal, 
    goalDetails, 
    generateStudyPlan, 
    generateAIPlan, 
    isGeneratingPlan 
  } = useStudyContext();
  
  const [view, setView] = useState<'week' | 'day'>('week');
  const [regeneratingWithAI, setRegeneratingWithAI] = useState(false);
  
  // Get unique days from study plan
  const days = [...new Set(studyPlan.map(session => session.day))];
  
  // Group sessions by day
  const sessionsByDay = days.reduce((acc, day) => {
    acc[day] = studyPlan.filter(session => session.day === day);
    return acc;
  }, {} as Record<string, typeof studyPlan>);
  
  const difficultyColor: Record<DifficultyLevel, string> = {
    easy: 'bg-green-50 text-green-700 border-green-100',
    easyToModerate: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    moderate: 'bg-blue-50 text-blue-700 border-blue-100',
    aboveModerate: 'bg-purple-50 text-purple-700 border-purple-100',
    tough: 'bg-orange-50 text-orange-700 border-orange-100'
  };
  
  const downloadAsPDF = () => {
    // In a real app, this would use a library like jsPDF to generate a PDF
    toast.success("Download feature will be implemented in the next version");
  };
  
  const shareStudyPlan = () => {
    // In a real app, this would use the Web Share API or create a shareable link
    toast.success("Share feature will be implemented in the next version");
  };
  
  const handleRegeneratePlan = async (useAI: boolean = false) => {
    if (useAI) {
      setRegeneratingWithAI(true);
      try {
        await generateAIPlan();
        toast.success("AI study plan regenerated successfully");
      } catch (error) {
        console.error("Error regenerating AI plan:", error);
      } finally {
        setRegeneratingWithAI(false);
      }
    } else {
      generateStudyPlan();
      toast.success("Study plan regenerated successfully");
    }
  };
  
  if (studyPlan.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 py-12 animate-fade-in">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-studbud-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Study Plan Generated Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              You haven't created a study plan yet. Add your subjects and available time slots to generate a personalized plan.
            </p>
            <Button 
              onClick={() => navigate('/study-details')}
              className="bg-studbud-500 hover:bg-studbud-600"
            >
              Create Study Plan
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Study Plan</h1>
          <p className="text-gray-600">
            {goalDetails ? (
              <span>
                {goal === 'exam' && `Exam Preparation: ${goalDetails}`}
                {goal === 'skill' && `Learning: ${goalDetails}`}
                {goal === 'daily' && `Daily Study: ${goalDetails}`}
                {goal === 'custom' && `Goal: ${goalDetails}`}
              </span>
            ) : (
              <span>Personalized for your study needs</span>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRegeneratePlan(true)}
                  disabled={isGeneratingPlan || regeneratingWithAI}
                  className="flex items-center"
                >
                  <Cpu className="h-4 w-4 mr-1" /> 
                  {regeneratingWithAI ? "Regenerating..." : "AI Regenerate"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate a new plan using AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRegeneratePlan(false)}
                  disabled={isGeneratingPlan || regeneratingWithAI}
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Basic Regenerate
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate a new plan with the same subjects and time slots</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={downloadAsPDF}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={shareStudyPlan}>
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share your study plan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <Tabs defaultValue="week" className="w-full" onValueChange={(value) => setView(value as 'week' | 'day')}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="week">Weekly View</TabsTrigger>
                <TabsTrigger value="day">Daily View</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="week" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex flex-col">
                    <h3 className="font-medium text-center bg-gray-100 py-2 rounded-t-lg">{day}</h3>
                    <div className="border rounded-b-lg p-2 h-full flex-grow bg-gray-50">
                      {sessionsByDay[day]?.length > 0 ? (
                        <div className="space-y-2">
                          {sessionsByDay[day]?.map((session) => (
                            <div 
                              key={session.id}
                              className={cn(
                                "rounded-lg p-2 text-xs border shadow-sm hover-card",
                                difficultyColor[session.subject.difficulty]
                              )}
                            >
                              <div className="font-medium">{session.subject.name}</div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center text-xs opacity-75">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {session.startTime}-{session.endTime}
                                </div>
                                <div className="text-xs opacity-75">
                                  {Math.floor(session.duration / 60)}h{session.duration % 60 > 0 ? ` ${session.duration % 60}m` : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-gray-400 py-4">
                          No sessions
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="day" className="mt-4">
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].filter(day => sessionsByDay[day]?.length > 0).map((day) => (
                  <div key={day} className="border rounded-lg overflow-hidden">
                    <h3 className="font-medium bg-gray-100 py-3 px-4">{day}</h3>
                    <div className="p-4 bg-gray-50">
                      <div className="space-y-3">
                        {sessionsByDay[day]?.map((session) => (
                          <div 
                            key={session.id}
                            className={cn(
                              "flex items-center rounded-lg p-3 border shadow-sm hover-card",
                              difficultyColor[session.subject.difficulty]
                            )}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{session.subject.name}</div>
                              <div className="text-sm opacity-75 mt-1">
                                {session.startTime} - {session.endTime}
                              </div>
                            </div>
                            <div className="text-sm opacity-75 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {Math.floor(session.duration / 60)}h{session.duration % 60 > 0 ? ` ${session.duration % 60}m` : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span>Study Plan Summary</span>
            <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full flex items-center">
              <Cpu className="h-3 w-3 mr-1" /> AI Enhanced
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Study Sessions</div>
              <div className="text-2xl font-bold">{studyPlan.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Study Time</div>
              <div className="text-2xl font-bold">
                {Math.floor(studyPlan.reduce((acc, session) => acc + session.duration, 0) / 60)}h
                {studyPlan.reduce((acc, session) => acc + session.duration, 0) % 60 > 0 ? 
                  ` ${studyPlan.reduce((acc, session) => acc + session.duration, 0) % 60}m` : ''}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Subjects Covered</div>
              <div className="text-2xl font-bold">{subjects.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlan;
