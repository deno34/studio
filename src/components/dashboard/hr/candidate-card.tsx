
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type Candidate, type CandidateStatusType, CandidateStatus } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CandidateCardProps {
    candidate: Candidate;
    onStatusChange: (candidateId: string, newStatus: CandidateStatusType) => void;
}

const pipelineStages = CandidateStatus.options;

export function CandidateCard({ candidate, onStatusChange }: CandidateCardProps) {
    return (
        <Card className="bg-card hover:shadow-md transition-shadow">
            <CardHeader className="p-3 flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={undefined} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-sm font-semibold">{candidate.name}</CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Move to...</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {pipelineStages.map(stage => (
                             <DropdownMenuItem 
                                key={stage} 
                                onClick={() => onStatusChange(candidate.id, stage)}
                                disabled={candidate.status === stage}
                            >
                                {stage}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-2">
                {candidate.matchPercentage !== undefined && (
                    <div className="flex items-center gap-1">
                        <Star className={`w-3.5 h-3.5 ${candidate.matchPercentage > 75 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        <span>{candidate.matchPercentage}% Match</span>
                    </div>
                )}
                <div className="flex flex-wrap gap-1">
                    {(candidate.matchingSkills || []).slice(0,3).map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
