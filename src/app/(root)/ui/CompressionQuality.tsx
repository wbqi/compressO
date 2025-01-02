import React from 'react'
import { snapshot, useSnapshot } from 'valtio'

import Slider from '@/components/Slider/Slider'
import Checkbox from '@/components/Checkbox'
import { videoProxy } from '../state'

function CompressionQuality() {
  const {
    state: {
      isCompressing,
      config: { quality: compressionQuality, shouldEnableQuality },
    },
  } = useSnapshot(videoProxy)

  const [quality, setQuality] = React.useState<number>(
    compressionQuality ?? 100,
  )
  const debounceRef = React.useRef<NodeJS.Timeout>()
  const qualityRef = React.useRef<number>(quality)

  React.useEffect(() => {
    qualityRef.current = quality
  }, [quality])

  React.useEffect(() => {
    if (quality !== snapshot(videoProxy)?.state?.config?.quality) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        if (videoProxy.state.config) {
          videoProxy.state.config.quality = quality
        }
      }, 500)
    }
    return () => {
      clearTimeout(debounceRef.current)
    }
  }, [quality])

  React.useEffect(() => {
    if (compressionQuality !== qualityRef.current) {
      if (
        typeof compressionQuality === 'number' &&
        !Number.isNaN(+compressionQuality)
      )
        setQuality(compressionQuality)
    }
  }, [compressionQuality])

  const handleQualityChange = React.useCallback((value: number | number[]) => {
    if (typeof value === 'number') {
      setQuality(value)
    }
  }, [])

  return (
    <>
      <Checkbox
        isSelected={shouldEnableQuality}
        onValueChange={() => {
          videoProxy.state.config.shouldEnableQuality = !shouldEnableQuality
        }}
        isDisabled={isCompressing}
      >
        <div className="flex items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mr-2">
            Quality
          </p>
        </div>
      </Checkbox>
      <Slider
        label
        aria-label="质量控制"
        size="sm"
        marks={[
          {
            value: 0,
            label: '缩小优先',
          },
          {
            value: 50,
            label: '均衡压缩',
          },
          {
            value: 99,
            label: '清晰优先',
          },
        ]}
        className="mb-8"
        classNames={{ mark: 'text-xs' }}
        getValue={(value) => {
          const val = Array.isArray(value) ? value?.[0] : +value
          return val < 50 ? 'Low' : val >= 50 && val < 100 ? '均衡压缩' : 'High'
        }}
        renderValue={(props) => (
          <p className="text-primary text-sm font-bold">{props?.children}</p>
        )}
        value={quality}
        onChange={handleQualityChange}
        isDisabled={isCompressing || !shouldEnableQuality}
      />
    </>
  )
}

export default CompressionQuality
