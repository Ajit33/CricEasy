
import { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import axios from "axios";

const CreateTournament = () => {
  const [step, setStep] = useState(1);
  const [tournamentName, setTournamentName] = useState("");
  const [place, setPlace] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState<number | null>(null);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [tournamentId, setTournamentId] = useState<number | null>(null);

  const handleNumberOfTeamsChange = (value: string) => {
    const num = Number.parseInt(value, 10);
    setNumberOfTeams(num);
    setTeamNames(Array(num).fill(""));
  };

  const handleTeamNameChange = (index: number, value: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = value;
    setTeamNames(newTeamNames);
  };

  const handleCreateTournament = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/tournament/create", {
        name: tournamentName,
        place,
        teamSize: numberOfTeams,
      });
      setTournamentId(response.data.tournament.id);
      setStep(2);
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  const handleSubmitTeams = async () => {
    try {
      if (!tournamentId) return;
      await Promise.all(
        teamNames.map((teamName) =>
          axios.post(`/api/tournaments/${tournamentId}/teams`, { name: teamName })
        )
      );
      console.log("Teams added successfully");
    } catch (error) {
      console.error("Error adding teams:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-500 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 flex justify-center text-green-500">
          {step === 1 ? "Create Tournament" : "Add Teams"}
        </h1>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tournamentName">Enter Tournament Name</Label>
              <Input
                id="tournamentName"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="Tournament Name"
              />
            </div>
            <div>
              <Label htmlFor="place">Enter Place Name</Label>
              <Input
                id="place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Place Name"
              />
            </div>
            <div>
              <Label htmlFor="numberOfTeams">Select Number of Teams</Label>
              <Select onValueChange={handleNumberOfTeamsChange}>
                <SelectTrigger id="numberOfTeams">
                  <SelectValue placeholder="Number of Teams" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4, 8, 16].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateTournament} className="w-full bg-green-500 hover:bg-green-900">
              Create
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Enter Team Names</h2>
            {Array.from({ length: numberOfTeams || 0 }).map((_, index) => (
              <div key={index}>
                <Label htmlFor={`team-${index}`}>Team {index + 1}</Label>
                <Input
                  id={`team-${index}`}
                  value={teamNames[index]}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Team ${index + 1} Name`}
                />
              </div>
            ))}
            <Button onClick={handleSubmitTeams} className="w-full bg-green-500 hover:bg-green-900">
              Submit Teams
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTournament;

