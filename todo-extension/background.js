chrome.runtime.onInstalled.addListener(() => {
  // Set up any alarms or listeners
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.jpg",
    title: "To-Do List Reminder",
    message: `Reminder for task: ${alarm.name}`,
  });
});
