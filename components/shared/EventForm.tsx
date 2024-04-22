"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { eventDefaultValues } from "@/constants"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { IEvent } from "@/lib/database/models/event.model"
import { useUploadThing } from "@/lib/uploadthing"
import { EventformSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useForm } from "react-hook-form"
import * as z from "zod"
import DropDown from "./DropDown"
import FileUploader from "./FileUploader"






type EventFormProps = {
    userId: string,
    type: "Create" | "Update"
    event?: IEvent,
    eventId?: string
}

export default function EventForm({ userId, type, event, eventId }: EventFormProps) {
    const [files, setFiles] = useState<File[]>([])
    const { startUpload } = useUploadThing("imageUploader")
    const router = useRouter()
    const initialValues = event && type === "Update"
        ? {
            ...event,
            startDateTime: new Date(event.startDateTime),
            endDateTime: new Date(event.endDateTime),

        }
        : eventDefaultValues;
    // 1. Define your form.
    const form = useForm<z.infer<typeof EventformSchema>>({
        resolver: zodResolver(EventformSchema),
        defaultValues: initialValues
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof EventformSchema>) {
        let uploadedImageUrl = values.imageUrl;

        if (files.length > 0) {
            const uploadedImages = await startUpload(files);
            if (!uploadedImages) return

            uploadedImageUrl = uploadedImages[0].url;
        }

        if (type === "Create") {
            try {
                const newEvent = await createEvent({
                    event: { ...values, imageUrl: uploadedImageUrl },
                    userId,
                    path: "profile"
                })
                if (newEvent) {
                    form.reset()
                    router.push(`/events/${newEvent._id}`)
                }
            } catch (error) {
                console.log(error);

            }
        }
        if (type === "Update") {
            if (!eventId) {
                router.back()
                return
            }
            try {
                const updatedEvent = await updateEvent({
                    userId,
                    event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
                    path: `/events/${eventId}`
                })
                if (updatedEvent) {
                    form.reset()
                    router.push(`/events/${updatedEvent._id}`)
                }
            } catch (error) {
                console.log(error);

            }
        }

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                {/* Event Name and Category */}
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">

                                <FormControl>
                                    <Input placeholder="Event Name" {...field} className="input-field" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="w-full">

                                <FormControl>
                                    <DropDown onChangeHandler={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Description and Image */}
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">

                                <FormControl>
                                    <Textarea placeholder="Description" {...field} className="textarea rounded-2xl h-72" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <FileUploader
                                        onFieldChange={field.onChange}
                                        imageUrl={field.value}
                                        setFiles={setFiles}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Location */}
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="w-full">

                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-100 px-4 py-2">
                                        <Image src="/assets/icons/location-grey.svg" alt="location" width={24} height={24} />
                                        <Input placeholder="Event location" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Start and End DateTime   */}
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">

                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-100 px-4 py-2">
                                        <Image src="/assets/icons/calendar.svg" alt="calendar" width={24} height={24} className="filter-gray" />
                                        <p className="ml-3 whitespace-nowrap text-gray-500">Start Date:</p>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            wrapperClassName="datePicker"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">

                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-100 px-4 py-2">
                                        <Image src="/assets/icons/calendar.svg" alt="calendar" width={24} height={24} className="filter-gray" />
                                        <p className="ml-3 whitespace-nowrap text-gray-500">End Date:</p>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            wrapperClassName="datePicker"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Price  */}
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">

                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-100 px-4 py-2">
                                        <Image src="/assets/icons/dollar.svg" alt="dollar" width={24} height={24} />
                                        <Input type="number" placeholder="0.00" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:bordre-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                                        <FormField
                                            control={form.control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem >

                                                    <FormControl>
                                                        <div className="flex-center ">
                                                            <label htmlFor="isFree"
                                                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >Free Ticket</label>
                                                            <Checkbox
                                                                onCheckedChange={field.onChange}
                                                                checked={field.value}
                                                                id="isFree" className="mr-2 h-5 w-5 border-2 border-primary-500" />

                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                {/* Event Url */}
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className="w-full">

                                <FormControl>
                                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-100 px-4 py-2">
                                        <Image src="/assets/icons/link.svg" alt="link" width={24} height={24} />
                                        <Input placeholder="Event URL" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    className="button col-span-2 w-full"
                >{form.formState.isSubmitting ? ('submitting...') : (
                    `${type} Event`
                )}</Button>
            </form>
        </Form>
    )
}
