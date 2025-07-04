const loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default loading;
