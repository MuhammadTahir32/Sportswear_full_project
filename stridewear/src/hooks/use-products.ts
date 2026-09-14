import { useQuery } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import type { Tables } from '#/lib/database.types'

type Product = Tables<'products'>
type ProductVariant = Tables<'product_variants'>
type ProductImage = Tables<'product_images'>
type Category = Tables<'categories'>

export type ProductWithDetails = Product & {
  category: Category | null
  product_variants: ProductVariant[]
  product_images: ProductImage[]
}

export type ProductListItem = Product & {
  category: Pick<Category, 'name' | 'slug'> | null
  product_images: Pick<ProductImage, 'storage_path' | 'position'>[]
}

export type ProductFilters = {
  categorySlug?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  search?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating'
  page?: number
  perPage?: number
}

const PRODUCTS_PER_PAGE = 12

export function useProducts(filters: ProductFilters = {}) {
  const {
    categorySlug,
    gender,
    minPrice,
    maxPrice,
    search,
    sort = 'newest',
    page = 1,
    perPage = PRODUCTS_PER_PAGE,
  } = filters

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          product_images(storage_path, position)
        `, { count: 'exact' })
        .eq('status', 'active')

      if (categorySlug) {
        query = query.eq('categories.slug', categorySlug)
      }

      if (gender) {
        query = query.eq('gender', gender)
      }

      if (minPrice !== undefined) {
        query = query.gte('sale_price', minPrice)
      }

      if (maxPrice !== undefined) {
        query = query.lte('sale_price', maxPrice)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      switch (sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'price_asc':
          query = query.order('sale_price', { ascending: true, nullsFirst: false })
          break
        case 'price_desc':
          query = query.order('sale_price', { ascending: false, nullsFirst: false })
          break
        case 'rating':
          query = query.order('avg_rating', { ascending: false })
          break
      }

      query = query.range(from, to)

      const { data, count, error } = await query

      if (error) throw error

      return {
        products: (data ?? []) as unknown as ProductListItem[],
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
      }
    },
    staleTime: 60 * 1000,
  })
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          product_variants(*),
          product_images(storage_path, position)
        `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (error) throw error

      return data as unknown as ProductWithDetails
    },
    enabled: !!slug,
    staleTime: 60 * 1000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error

      return (data ?? []) as Category[]
    },
    staleTime: 5 * 60 * 1000,
  })
}
