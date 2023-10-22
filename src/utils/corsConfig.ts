const corsOption = {
  // origin: ['https://eventpilot-dev.onrender.com', 'https://event-pilot.onrender.com'],
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
export default corsOption;
