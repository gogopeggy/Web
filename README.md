# Custom Datepicker Component
This is a simple React datepicker component built without using any third-party libraries. The datepicker allows users to select a start date and an end date, with specific behaviors based on the selected dates. The component also highlights the current day with a yellow background and displays month navigation buttons that are disabled.
## Features
1. **Start and End Date Selection:**
   - First click sets the start date.
   - Second click sets the end date if it is the same or later than the start date.
   - Clicking a date earlier than the start date resets the start date.

2. **Non-Current Month Days:**
   - Show a not-allowed icon when hovering over non-current month days.
   - Disable click on non-current month days.

3. **Current Month Display:**
   - Shows the current month and year at the top.
   - Month navigation buttons (previous and next) are displayed but disabled.

4. **Current Day Highlight:**
   - Highlights the current day with a yellow background.

## Installation and Setup Instructions
To use this component in your project, follow these steps:
1. Clone the repository or copy the component files into your project.
```bash
git clone https://github.com/gogopeggy/first-build.git
cd first-build
```
2. Installation:
```bash
npm install
```
3. To start server:
```bash
npm run start
```
4. Make sure to install g serve if you'd like to build:
 ```bash
npm install -g serve
```
5. To build:
 ```bash
npm run build
```
6. To serve:
 ```bash
serve -s build
```

