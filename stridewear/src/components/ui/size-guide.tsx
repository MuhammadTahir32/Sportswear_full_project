import { useState } from 'react'
import { Modal } from '#/components/ui/modal'
import { cn } from '#/lib/cn'

type SizeGuideProps = {
  gender?: string
}

const sizeData = {
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
  },
}

export function SizeGuide({ gender }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const data = gender === 'Women' ? sizeData.Women : sizeData.Men

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
              {gender === 'Women' ? 'Women\'s' : 'Men\'s'} apparel measurements
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
              <strong className="text-brand-black">How to measure:</strong> Chest — measure around the fullest part of your chest. Waist — measure around your natural waistline. Hips — measure around the fullest part of your hips.
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
