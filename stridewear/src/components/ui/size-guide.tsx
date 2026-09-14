import { useState } from 'react'
import { Modal } from '#/components/ui/modal'
import { cn } from '#/lib/cn'

type SizeGuideProps = {
  gender?: string
  category?: string
  productName?: string
}

const FOOTWEAR_CATEGORIES = ['running', 'training', 'football', 'basketball', 'soccer', 'tennis', 'golf', 'cleats']
const FOOTWEAR_KEYWORDS = ['shoe', 'shoes', 'boot', 'boots', 'sneaker', 'sneakers', 'footwear', 'heel', 'heels', 'sandal', 'sandals', 'runner', 'high']

const apparelSizeData = {
  Men: {
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hips (in)'],
    rows: [
      ['XS', '32-34', '28-30', '33-35'],
      ['S', '35-37', '31-33', '36-38'],
      ['M', '38-40', '34-36', '39-41'],
      ['L', '41-43', '37-39', '42-44'],
      ['XL', '44-46', '40-42', '45-47'],
      ['2XL', '47-49', '43-45', '48-50'],
    ],
    howToMeasure: 'Chest — measure around the fullest part of your chest. Waist — measure around your natural waistline. Hips — measure around the fullest part of your hips.',
  },
  Women: {
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hips (in)'],
    rows: [
      ['XS', '31-32', '24-25', '34-35'],
      ['S', '33-34', '26-27', '36-37'],
      ['M', '35-36', '28-29', '38-39'],
      ['L', '37-39', '30-32', '40-42'],
      ['XL', '40-42', '33-35', '43-45'],
      ['2XL', '43-45', '36-38', '46-48'],
    ],
    howToMeasure: 'Chest — measure around the fullest part of your chest. Waist — measure around your natural waistline. Hips — measure around the fullest part of your hips.',
  },
}

const footwearSizeData = {
  Men: {
    headers: ['US', 'EU', 'UK', 'Foot Length (in)'],
    rows: [
      ['7', '40', '6', '9.6'],
      ['7.5', '40.5', '6.5', '9.8'],
      ['8', '41', '7', '10.0'],
      ['8.5', '42', '7.5', '10.2'],
      ['9', '42.5', '8', '10.4'],
      ['9.5', '43', '8.5', '10.6'],
      ['10', '44', '9', '10.8'],
      ['10.5', '44.5', '9.5', '11.0'],
      ['11', '45', '10', '11.2'],
      ['12', '46', '11', '11.6'],
      ['13', '47.5', '12', '12.0'],
    ],
    howToMeasure: 'Foot length — stand on a piece of paper, mark your heel and longest toe, measure the distance in inches.',
  },
  Women: {
    headers: ['US', 'EU', 'UK', 'Foot Length (in)'],
    rows: [
      ['5', '35.5', '2.5', '8.5'],
      ['5.5', '36', '3', '8.7'],
      ['6', '36.5', '3.5', '8.9'],
      ['6.5', '37.5', '4', '9.1'],
      ['7', '38', '4.5', '9.3'],
      ['7.5', '38.5', '5', '9.4'],
      ['8', '39', '5.5', '9.6'],
      ['8.5', '40', '6', '9.8'],
      ['9', '40.5', '6.5', '10.0'],
      ['9.5', '41', '7', '10.2'],
      ['10', '42', '7.5', '10.4'],
    ],
    howToMeasure: 'Foot length — stand on a piece of paper, mark your heel and longest toe, measure the distance in inches.',
  },
}

function detectFootwear(category?: string, productName?: string): boolean {
  const catLower = category?.toLowerCase() ?? ''
  const nameLower = productName?.toLowerCase() ?? ''

  if (FOOTWEAR_CATEGORIES.some((kw) => catLower.includes(kw))) return true
  if (FOOTWEAR_KEYWORDS.some((kw) => nameLower.includes(kw))) return true

  return false
}

export function SizeGuide({ gender, category, productName }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const footwear = detectFootwear(category, productName)
  const allData = footwear ? footwearSizeData : apparelSizeData
  const data = gender === 'Women' ? allData.Women : allData.Men
  const label = footwear ? 'Footwear' : 'Apparel'

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-semibold uppercase tracking-wider text-brand-black underline underline-offset-2 hover:text-brand-lime-dark"
      >
        Size Guide
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-2xl uppercase text-brand-black">
              Size Guide
            </h2>
            <p className="mt-1 text-xs text-brand-gray-400">
              {gender === 'Women' ? "Women's" : "Men's"} {label}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-gray-100">
                  {data.headers.map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 font-bold uppercase tracking-wider text-brand-gray-400"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, i) => (
                  <tr
                    key={row[0]}
                    className={cn(
                      'border-b border-brand-gray-50',
                      i % 2 === 0 && 'bg-brand-gray-50',
                    )}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={cell}
                        className={cn(
                          'px-3 py-2.5',
                          j === 0 ? 'font-bold text-brand-black' : 'text-brand-gray-700',
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-brand-gray-50 p-3">
            <p className="text-[11px] leading-relaxed text-brand-gray-400">
              <strong className="text-brand-black">How to measure:</strong> {data.howToMeasure}
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
