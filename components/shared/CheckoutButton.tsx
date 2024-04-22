"use client"
import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '../ui/button'
import Checkout from './Checkout'



export default function CheckoutButton({ event }: { event: IEvent }) {
    const { user } = useUser()
    const userId = user?.publicMetadata.userId as string



    const hasEventFinished = new Date(event.endDateTime) < new Date()
    return (
        <div className='flex items-center gap-3'>
            {hasEventFinished ? (
                <p className='p-2 text-red-400'>Sorry, ticket no longer avaliable!</p>
            ) : (
                <>
                    <SignedOut>
                        <Button asChild className='button rounded-full' size="lg">
                            <Link href="/sign-in">Get Ticket</Link>
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <Checkout event={event} userId={userId} />
                    </SignedIn>
                </>
            )}
        </div>
    )
}
