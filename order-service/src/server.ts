import expressApp from "./expressApp";

const PORT = process.env.APP_PORT || 9000;

export const StartServer = async () => {
  expressApp.listen(PORT, () => {
    console.log(`[Server]: App is running on port ${PORT} !!`);
  });

  process.on("uncaughtException",async(err)=>{
    console.log(err);
    process.exit(1);
  })
};

StartServer().then(()=>{
    console.log("[Server]: Server is up !!");
})
