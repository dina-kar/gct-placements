import * as React from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  className?: string
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value, onChange, placeholder = "Pick a date", className }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>(
      value ? new Date(value) : undefined
    )

    React.useEffect(() => {
      if (value) {
        setDate(new Date(value))
      }
    }, [value])

    const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate)
      if (selectedDate && onChange) {
        onChange(selectedDate.toISOString().split('T')[0])
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
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  },
)
DatePicker.displayName = "DatePicker"
