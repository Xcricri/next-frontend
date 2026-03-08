import { typePortoImage } from './PortofolioImage'

export interface typePortofolio {
    id: number
    title: string
    slug: string
    short_description: string
    full_content: string
    main_image_url: string
    project_date: string
    created_at: string
    update_at: string
    images?: typePortoImage[]
}