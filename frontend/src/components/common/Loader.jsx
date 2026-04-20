// src/components/common/Loader.jsx
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
    </div>
  );
};

export default Loader;

