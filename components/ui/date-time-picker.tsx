import * as React from "react"
import { Calendar, Clock } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  value?: string
  onChange?: (dateTime: string) => void
  placeholder?: string
  className?: string
  showTime?: boolean
}

export const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  ({ value, onChange, placeholder = "Pick a date and time", className, showTime = true }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>()
    const [time, setTime] = React.useState<string>("23:59")

    React.useEffect(() => {
      if (value) {
        const parsedDate = new Date(value)
        setDate(parsedDate)
        if (showTime) {
          const hours = String(parsedDate.getHours()).padStart(2, '0')
          const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
          setTime(`${hours}:${minutes}`)
        }
      } else {
        setDate(undefined)
        setTime("23:59")
      }
    }, [value, showTime])

    const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate)
      updateDateTime(selectedDate, time)
    }

    const handleTimeChange = (newTime: string) => {
      setTime(newTime)
      updateDateTime(date, newTime)
    }

    const updateDateTime = (selectedDate: Date | undefined, timeString: string) => {
      if (selectedDate && onChange) {
        if (showTime) {
          const [hours, minutes] = timeString.split(':').map(Number)
          const dateTime = new Date(selectedDate)
          dateTime.setHours(hours, minutes, 0, 0)
          onChange(dateTime.toISOString())
        } else {
          // For date-only, use the local date string
          const year = selectedDate.getFullYear()
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
          const day = String(selectedDate.getDate()).padStart(2, '0')
          onChange(`${year}-${month}-${day}`)
        }
      }
    }

    const formatDisplayDate = () => {
      if (!date) return placeholder
      
      if (showTime) {
        return `${format(date, "PPP")} at ${time}`
      } else {
        return format(date, "PPP")
      }
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className,
            )}
            ref={ref}
          >
            {showTime ? (
              <Clock className="mr-2 h-4 w-4" />
            ) : (
              <Calendar className="mr-2 h-4 w-4" />
            )}
            <span>{formatDisplayDate()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-3">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
            {showTime && (
              <div className="space-y-2 border-t pt-3">
                <Label htmlFor="time">Time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-auto"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Default is 11:59 PM if no time is selected
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  },
)
DateTimePicker.displayName = "DateTimePicker"
