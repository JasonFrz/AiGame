import leader_1 from "../assets/Leaders_Cards_1.jpg";
import leader_2 from "../assets/Leaders_Cards_2.jpg";

const SelectLeader = ({ setLeader }) => {
  return (
    <div className="bg-amber-800 rounded-2xl p-10 flex flex-col items-center gap-4">
      <h1 className="text-4xl">Choose Your Leader!</h1>
      <div className="flex gap-2">
        <button className="transition transform hover:scale-105 hover:shadow-[0_0_20px_#FFD700] rounded-xl">
          <img
            src={leader_1}
            alt="leader_1"
            className="w-auto h-100"
            onClick={() => {
              setLeader(1);
            }}
          />
        </button>
        <button className="transition transform hover:scale-105 hover:shadow-[0_0_20px_#FFD700] rounded-xl">
          <img
            src={leader_2}
            alt="leader_2"
            className="w-auto h-100"
            onClick={() => {
              setLeader(2);
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default SelectLeader;
