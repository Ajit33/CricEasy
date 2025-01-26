import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="h-[100%] w-full flex justify-center items-center bg-black px-[150px] py-[120px]">
      <div className="w-full   mx-auto item center ">
        {/* text */}
        <h1 className="text-[60px] font-bold leading-tight text-white">
          Organize Cricket Tournaments{" "}
          <span className="text-green-500">Like Never Before</span>
        </h1>
        <p className="mt-4 text-xl text-white">
          Create tournaments, manage teams, track live scores, and bring your
          cricket community together in one powerful platform.
        </p>
        <div className=" flex mt-6 gap-[40px]">
          <Button className="px-[40px] py-[30px] rounded-full text-lg bg-green-500">
            Create Tournament
          </Button>
          <Button className="px-[40px] py-[30px] rounded-full bg-transparent text-lg border-2 border-green-500">
            View Live score
          </Button>
        </div>
      </div>

      <div className="w-full p-[30px]">
        <div className="relative cursor-pointer">
          {/* Glowing Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-300 rounded-lg blur opacity-75"></div>

          {/* Content Container */}
          <div className="relative p-6 bg-[#2a2a2a] rounded-lg leading-none space-y-4">
            {/* Current Match Section */}
            <div className="p-4 bg-[#3a3a3a] rounded-lg">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-white text-xl font-medium">
                    Current Match
                  </h2>
                  <p className="text-gray-400 text-sm">Team A vs Team B</p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-xl font-bold">156/4</div>
                  <div className="text-gray-400 text-sm">18.2 overs</div>
                </div>
              </div>
            </div>

            {/* Tournament Status Section */}
            <div className="p-4 bg-[#3a3a3a] rounded-lg">
              <h2 className="text-white text-xl font-medium mb-3">
                Tournament Status
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Tournaments:</span>
                  <span className="text-green-400 font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Live Matches:</span>
                  <span className="text-green-400 font-medium">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
