
import { PublicKey } from '@solana/web3.js';

/**
 * Interface for NFT metadata attributes/traits
 */
export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

/**
 * Interface for NFT creator information
 */
export interface NFTCreator {
  address: string;
  share: number;
  verified?: boolean;
}

/**
 * Interface for NFT collection information
 */
export interface NFTCollection {
  name: string;
  symbol: string;
  description?: string;
  externalUrl?: string;
  image?: string;
  sellerFeeBasisPoints: number;
  creators?: NFTCreator[];
}

/**
 * Interface for individual NFT metadata
 */
export interface NFTMetadata {
  name: string;
  symbol: string;
  description?: string;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes?: NFTAttribute[];
  properties?: {
    files?: Array<{
      uri: string;
      type: string;
    }>;
    category?: string;
    creators?: NFTCreator[];
    [key: string]: any;
  };
  seller_fee_basis_points?: number;
  collection?: {
    name?: string;
    family?: string;
    [key: string]: any;
  };
}

/**
 * Interface for NFT asset data used in the uploader
 */
export interface NFTAsset {
  id: string;
  file?: File;
  preview?: string;
  name: string;
  metadata?: NFTMetadata;
}

/**
 * Interface for NFT details returned by service
 */
export interface NFTDetails {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators?: NFTCreator[];
  collection?: {
    key: string;
    verified: boolean;
  };
  isMutable?: boolean;
  primarySaleHappened?: boolean;
  updateAuthority?: string;
  [key: string]: any;
}

/**
 * Interface for NFT minting result
 */
export interface NFTMintResult {
  collectionMint: string;
  nftMints: string[];
}

/**
 * Interface for upload results
 */
export interface NFTUploadResult {
  imageUris: string[];
  metadataUris: string[];
}
