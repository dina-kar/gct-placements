import * as React from "react"
import { Calendar } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const DatePicker = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !props.value && "text-muted-foreground",
              className,
            )}
            {...props}
            ref={ref}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {props.value ? props.value : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div>Calendar Placeholder</div>
        </PopoverContent>
      </Popover>
    )
  },
)
DatePicker.displayName = "DatePicker"
