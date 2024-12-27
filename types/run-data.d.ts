interface Activity {
    run_id: number
    name: string
    distance: number
    moving_time: string
    type: string
    start_date: string
    start_date_local: string
    location_country?: string | null
    summary_polyline?: string | null
    average_heartrate?: number | null
    average_speed: number
    streak: number
}

interface RunRecord {
    id: number
    origin: Activity
    startDate: string
    distance: string
    paceParts: string | null
    heartRate: string | undefined
    runTime: string
    moment: string
    location: {
        province: string
        city: string
        district: string
        country?: string
    }
    address: string
}
