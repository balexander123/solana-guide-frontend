import { Card } from './Card'
import { FC, useEffect, useMemo, useState } from 'react'
import { Guide } from '../models/Guide'
import * as web3 from '@solana/web3.js'
import { GuideCoordinator } from '../coordinators/GuideCoordinator'
import { Button, Center, HStack, Input, Spacer } from '@chakra-ui/react'

export const GuideList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [guides, setGuides] = useState<Guide[]>([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [foo, setFoo] = useState('')

    useEffect(() => {
        GuideCoordinator.fetchPage(
            connection, 
            page, 
            5,
            search,
            search !== ''
        ).then(setGuides)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search])
    
    return (
        <div>
            <Center>
                <Input
                    id='search'
                    color='gray.400'
                    onChange={event => setSearch(event.currentTarget.value)}
                    placeholder='Search'
                    w='97%'
                    mt={2}
                    mb={2}
                />
            </Center>
            {
                guides.map((guide, i) => <Card key={i} guide={guide} onClick={() => setFoo('')} /> )
            }
            <Center>
                <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
                    {
                        page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>
                    }
                    <Spacer />
                    {
                        GuideCoordinator.accounts.length > page * 5 &&
                        <Button onClick={() => setPage(page + 1)}>Next</Button>
                    }
                </HStack>
            </Center>
        </div>
    )
}