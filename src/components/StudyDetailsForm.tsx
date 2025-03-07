import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Clock, BookOpen, Sparkles, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudyContext, Subject, TimeSlot, DifficultyLevel, StudyGoal } from '@/context/StudyContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const StudyDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const { 
    goal, 
    setGoal, 
    goalDetails, 
    setGoalDetails,
    subjects, 
    addSubject, 
    removeSubject, 
    updateSubject,
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    generateStudyPlan,
    generateAIPlan,
    isGeneratingPlan
  } = useStudyContext();

  const [newSubject, setNewSubject] = useState({
    name: '',
    difficulty: 'moderate' as DifficultyLevel
  });

  const [newTimeSlot, setNewTimeSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30'
  });

  const handleAddSubject = () => {
    if (!newSubject.name.trim()) {
      toast.error("Please enter a subject name");
      return;
    }

    addSubject({
      id: `subject-${Math.random().toString(36).substr(2, 9)}`,
      name: newSubject.name.trim(),
      difficulty: newSubject.difficulty
    });

    setNewSubject({
      name: '',
      difficulty: 'moderate'
    });

    toast.success("Subject added successfully");
  };

  const handleAddTimeSlot = () => {
    // Validate time format and order
    const startMinutes = timeToMinutes(newTimeSlot.startTime);
    const endMinutes = timeToMinutes(newTimeSlot.endTime);
    
    if (endMinutes <= startMinutes) {
      toast.error("End time must be after start time");
      return;
    }

    addTimeSlot({
      id: `timeslot-${Math.random().toString(36).substr(2, 9)}`,
      day: newTimeSlot.day,
      startTime: newTimeSlot.startTime,
      endTime: newTimeSlot.endTime
    });

    toast.success("Time slot added successfully");
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleGeneratePlan = async (useAI: boolean = false) => {
    if (subjects.length === 0) {
      toast.error("Please add at least one subject");
      return;
    }

    if (timeSlots.length === 0) {
      toast.error("Please add at least one time slot");
      return;
    }

    if (useAI) {
      await generateAIPlan();
    } else {
      generateStudyPlan();
      toast.success("Study plan generated successfully");
    }
    
    navigate('/generated-plan');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-studbud-500" />
            Study Goal
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {goalOptions.map((option) => (
                <div 
                  key={option.value}
                  onClick={() => setGoal(option.value)}
                  className={cn(
                    "cursor-pointer rounded-xl p-4 text-center transition-all duration-200 hover-card",
                    goal === option.value
                      ? "bg-studbud-50 border-2 border-studbud-500 shadow-md"
                      : "border border-gray-200"
                  )}
                >
                  <div className="flex justify-center mb-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      goal === option.value
                        ? "bg-studbud-100 text-studbud-700"
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {option.icon}
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">{option.label}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {goalDetailLabels[goal] || "Additional Details"}
              </label>
              <Input
                value={goalDetails}
                onChange={(e) => setGoalDetails(e.target.value)}
                placeholder="E.g., IELTS preparation, Learning Python, etc."
                className="w-full"
              />
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-studbud-500" />
            Subjects
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
                </label>
                <Input
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder="E.g., Mathematics"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <Select 
                  value={newSubject.difficulty}
                  onValueChange={(value) => setNewSubject({...newSubject, difficulty: value as DifficultyLevel})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="easyToModerate">Easy to Moderate</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aboveModerate">Above Moderate</SelectItem>
                    <SelectItem value="tough">Tough</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddSubject}
                  className="w-full bg-studbud-500 hover:bg-studbud-600"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Subject
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your Subjects</h3>
              {subjects.length === 0 ? (
                <p className="text-gray-500 text-center py-4 border border-dashed rounded-lg">
                  No subjects added yet. Add your first subject above.
                </p>
              ) : (
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <div 
                      key={subject.id}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{subject.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({difficultyLabel[subject.difficulty]})
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSubject(subject.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove subject</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-studbud-500" />
            Available Time Slots
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day
                </label>
                <Select 
                  value={newTimeSlot.day}
                  onValueChange={(value) => setNewTimeSlot({...newTimeSlot, day: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={newTimeSlot.startTime}
                  onChange={(e) => setNewTimeSlot({...newTimeSlot, startTime: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <Input
                  type="time"
                  value={newTimeSlot.endTime}
                  onChange={(e) => setNewTimeSlot({...newTimeSlot, endTime: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddTimeSlot}
                  className="w-full bg-studbud-500 hover:bg-studbud-600"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Time Slot
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Your Time Slots</h3>
              {timeSlots.length === 0 ? (
                <p className="text-gray-500 text-center py-4 border border-dashed rounded-lg">
                  No time slots added yet. Add your first time slot above.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <div 
                      key={slot.id}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{slot.day}</span>
                        <span className="text-sm text-gray-500 block">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTimeSlot(slot.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove time slot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </section>

        <div className="flex flex-col sm:flex-row justify-center pt-4 gap-4">
          <Button 
            onClick={() => handleGeneratePlan(true)}
            className="px-6 py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
            disabled={subjects.length === 0 || timeSlots.length === 0 || isGeneratingPlan}
          >
            <Cpu className="h-5 w-5 mr-2" /> 
            {isGeneratingPlan ? "Generating..." : "Generate AI Study Plan"}
          </Button>
          
          <Button 
            onClick={() => handleGeneratePlan(false)}
            className="px-6 py-6 text-lg bg-studbud-500 hover:bg-studbud-600"
            disabled={subjects.length === 0 || timeSlots.length === 0 || isGeneratingPlan}
          >
            <Sparkles className="h-5 w-5 mr-2" /> Generate Basic Study Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

const goalOptions: {
  value: StudyGoal;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'exam',
    label: 'Exam Prep',
    description: 'Prepare for a specific test or exam',
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    value: 'skill',
    label: 'Skill Learning',
    description: 'Learn a new skill or subject',
    icon: <Sparkles className="h-5 w-5" />
  },
  {
    value: 'daily',
    label: 'Daily Study',
    description: 'Regular study routine',
    icon: <Clock className="h-5 w-5" />
  },
  {
    value: 'custom',
    label: 'Custom Goal',
    description: 'Define your own study goal',
    icon: <Sparkles className="h-5 w-5" />
  }
];

const goalDetailLabels: Record<StudyGoal, string> = {
  exam: 'Which exam are you preparing for?',
  skill: 'What skill are you learning?',
  daily: 'What is your daily study goal?',
  custom: 'Describe your custom study goal'
};

const difficultyLabel: Record<DifficultyLevel, string> = {
  easy: 'Easy',
  easyToModerate: 'Easy to Moderate',
  moderate: 'Moderate',
  aboveModerate: 'Above Moderate',
  tough: 'Tough'
};

export default StudyDetailsForm;
