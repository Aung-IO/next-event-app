import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventByUser } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

export default async function Profile() {
    const { sessionClaims } = auth()
    const userId = sessionClaims?.userId as string;

    const organizedEvent = await getEventByUser({
        userId,
        page: 1,
    })
    return (
        <>
            {/* My Tickets */}
            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
                    <Button asChild size="lg" className="button hidden sm:flex">
                        <Link href="/#events">
                            Explore More Events
                        </Link>
                    </Button>
                </div>
            </section>
            <section className="wrapper my-8">
                <h1>Collection here</h1>
            </section>
            {/* My Events */}
            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
                    <Button asChild size="lg" className="button hidden sm:flex">
                        <Link href="/events/create">
                            Create New Event
                        </Link>
                    </Button>
                </div>
            </section>
            <section className="wrapper my-8">
                <Collection
                    data={organizedEvent?.data}
                    emptyTitle="No Events Found"
                    emptyStateSubText="Come back soon!"
                    collectionType="ALL_Events"
                    limit={6}
                    page={1}
                    totalPages={2}
                />
            </section>
        </>
    )
}
