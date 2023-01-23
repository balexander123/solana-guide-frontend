import bs58 from "bs58"
import * as web3 from "@solana/web3.js"
import { Guide } from "../models/Guide"
import { GUIDE_REVIEW_PROGRAM_ID } from "../utils/constants"

export class GuideCoordinator {
    static accounts: web3.PublicKey[] = []

    static async prefetchAccounts(connection: web3.Connection, search: string) {
        const offset = 4 + 6 + 1 + 32 + 1 + 4
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(GUIDE_REVIEW_PROGRAM_ID),
            {
                dataSlice: { offset: 0, length: offset + 20 },
                filters:
                    search === ""
                        ? [
                              {
                                  memcmp: {
                                      offset: 4,
                                      bytes: bs58.encode(Buffer.from("review")),
                                  },
                              },
                          ]
                        : [
                              {
                                  memcmp: {
                                      offset: offset,
                                      bytes: bs58.encode(Buffer.from(search)),
                                  },
                              },
                          ],
            }
        )

        accounts.sort((a, b) => {
            const lengthA = a.account.data.readUInt32LE(0)
            const lengthB = b.account.data.readUInt32LE(0)
            const dataA = a.account.data.slice(offset, offset + lengthA)
            const dataB = b.account.data.slice(offset, offset + lengthB)
            return dataA.compare(dataB)
        })

        this.accounts = accounts.map((account) => account.pubkey)
    }

    static async fetchPage(
        connection: web3.Connection,
        page: number,
        perPage: number,
        search: string,
        reload: boolean = false
    ): Promise<Guide[]> {
        if (this.accounts.length === 0 || reload) {
            await this.prefetchAccounts(connection, search)
        }

        const paginatedPublicKeys = this.accounts.slice(
            (page - 1) * perPage,
            page * perPage
        )

        if (paginatedPublicKeys.length === 0) {
            return []
        }

        const accounts = await connection.getMultipleAccountsInfo(
            paginatedPublicKeys
        )

        const guides = accounts.reduce((accum: Guide[], account) => {
            const guide = Guide.deserialize(account?.data)
            if (!guide) {
                return accum
            }

            return [...accum, guide]
        }, [])

        return guides
    }
}
