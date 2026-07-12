import dayjs from "dayjs"

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
