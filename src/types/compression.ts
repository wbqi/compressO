export const extensions = {
  video: { mp4: 'mp4', mov: 'mov', mkv: 'mkv', webm: 'webm', avi: 'avi' },
} as const

export const compressionPresets = {
  ironclad: '质量优先',
  thunderbolt: '速度优先',
} as const

export type CompressionResult = {
  fileName: string
  filePath: string
}

export enum CustomEvents {
  VideoCompressionProgress = 'VideoCompressionProgress',
  CancelInProgressCompression = 'CancelInProgressCompression',
}

export type VideoCompressionProgress = {
  videoId: string
  fileName: string
  currentDuration: string
}

export type VideoThumbnail = {
  id: string
  fileName: string
  filePath: string
}
