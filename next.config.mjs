import million from 'million/compiler'
import { withContentlayer } from 'next-contentlayer'
import createNextBundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const millionConfig = {
  auto: { rsc: true },
  skip: [],
}

const withBundleAnalyzer = createNextBundleAnalyzer({
  // eslint-disable-next-line node/prefer-global/process
  enabled: process.env.ANALYZE === 'true',
})

export default million.next(withBundleAnalyzer(withContentlayer(nextConfig)), millionConfig)
