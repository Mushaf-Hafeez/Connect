import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import calendar from "dayjs/plugin/calendar"
import updateLocale from "dayjs/plugin/updateLocale"

// Load required Day.js plugins
dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.extend(updateLocale)

// Customize calendar formats to match WhatsApp style
dayjs.updateLocale("en", {
  calendar: {
    lastDay: "[Yesterday]",
    sameDay: "h:mm A",
    nextDay: "[Tomorrow]", // WhatsApp rarely uses this for chat history, but good to have
    lastWeek: "dddd",
    sameElse: "DD/MM/YYYY", // Adjust format (e.g., MM/DD/YYYY) based on region
  },
})

export const getFileType = (extension: string): string => {
  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "heic"]

  const videoTypes = ["mp4", "mov", "avi", "mkv", "webm"]

  let type: string

  if (imageTypes.includes(extension.toLowerCase())) {
    type = "image"
  } else if (videoTypes.includes(extension.toLowerCase())) {
    type = "video"
  } else {
    type = "pdf"
  }

  return type
}

export const getFormattedTime = (time: Date) => {
  const formattedDate = dayjs(time).format("MM/DD/YY hh:mm A")
  return formattedDate
}

export const formatWhatsAppTime = (timestamp: Date) => {
  const messageTime = dayjs(timestamp)
  const now = dayjs()

  // If the message is older than 6 days, display the full date
  if (now.diff(messageTime, "day") > 6) {
    return messageTime.format("DD/MM/YYYY")
  }

  // Use customized calendar for Today, Yesterday, and Days of the week
  return messageTime.calendar(now)
}
