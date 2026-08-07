/**
 * Well-known IPv4 ranges, so a visit from a university or lab reads as the
 * institution rather than as a number.
 *
 * Deliberately a static table: resolving an address properly means an ASN
 * lookup per visit against an external service, which would put a network call
 * (and a rate limit) in front of every beacon. This covers the networks worth
 * recognising and returns undefined for everything else, which is the honest
 * answer rather than a guess. Add ranges as they come up.
 */

interface Range {
  cidr: string
  org: string
}

const RANGES: Range[] = [
  // UK
  { cidr: '128.40.0.0/16', org: 'UCL' },
  { cidr: '144.82.0.0/16', org: 'UCL' },
  { cidr: '193.60.0.0/14', org: 'JANET (UK academic)' },
  { cidr: '129.31.0.0/16', org: 'Imperial College London' },
  { cidr: '155.198.0.0/16', org: 'Imperial College London' },
  { cidr: '131.111.0.0/16', org: 'University of Cambridge' },
  { cidr: '129.67.0.0/16', org: 'University of Oxford' },
  { cidr: '163.1.0.0/16', org: 'University of Oxford' },
  { cidr: '158.143.0.0/16', org: 'University of Edinburgh' },

  // US universities
  { cidr: '164.67.0.0/16', org: 'UCLA' },
  { cidr: '131.179.0.0/16', org: 'UCLA' },
  { cidr: '149.142.0.0/16', org: 'UCLA' },
  { cidr: '128.97.0.0/16', org: 'UCLA' },
  { cidr: '18.0.0.0/8', org: 'MIT' },
  { cidr: '171.64.0.0/14', org: 'Stanford' },
  { cidr: '128.12.0.0/16', org: 'Stanford' },
  { cidr: '128.32.0.0/16', org: 'UC Berkeley' },
  { cidr: '169.229.0.0/16', org: 'UC Berkeley' },
  { cidr: '128.2.0.0/16', org: 'Carnegie Mellon' },
  { cidr: '128.112.0.0/16', org: 'Princeton' },
  { cidr: '140.247.0.0/16', org: 'Harvard' },
  { cidr: '128.59.0.0/16', org: 'Columbia' },
  { cidr: '128.30.0.0/15', org: 'MIT CSAIL' },
  { cidr: '35.0.0.0/16', org: 'University of Michigan' },
  { cidr: '132.174.0.0/16', org: 'NYU' },
  { cidr: '128.122.0.0/16', org: 'NYU' },

  // Korea
  { cidr: '143.248.0.0/16', org: 'KAIST' },
  { cidr: '147.46.0.0/16', org: 'Seoul National University' },
  { cidr: '163.152.0.0/16', org: 'Korea University' },
  { cidr: '165.132.0.0/16', org: 'Yonsei University' },
  { cidr: '115.145.0.0/16', org: 'Sungkyunkwan University' },

  // Labs and industry research
  { cidr: '160.79.104.0/23', org: 'Anthropic' },
  { cidr: '20.171.206.0/24', org: 'OpenAI' },
  { cidr: '104.210.0.0/16', org: 'Microsoft' },
  { cidr: '8.8.8.0/24', org: 'Google' },
  { cidr: '66.249.64.0/19', org: 'Googlebot' },
  { cidr: '17.0.0.0/8', org: 'Apple' },
]

function toLong(ip: string): number | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  let out = 0
  for (const part of parts) {
    const octet = Number(part)
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null
    out = out * 256 + octet
  }
  return out
}

const PARSED = RANGES.flatMap(({ cidr, org }) => {
  const [base, bitsText] = cidr.split('/')
  const long = toLong(base)
  const bits = Number(bitsText)
  if (long === null || !Number.isInteger(bits) || bits < 0 || bits > 32) return []
  // >>> 0 keeps the mask unsigned; a plain << 32-0 would wrap to 0.
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0
  return [{ network: (long & mask) >>> 0, mask, org }]
})

/** The organisation an address belongs to, or undefined when it is not a known network. */
export function orgForIp(ip?: string): string | undefined {
  if (!ip) return undefined
  const long = toLong(ip.trim())
  if (long === null) return undefined
  for (const range of PARSED) {
    if ((long & range.mask) >>> 0 === range.network) return range.org
  }
  return undefined
}
