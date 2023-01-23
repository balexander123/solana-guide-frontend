import { Center, Box, Heading } from "@chakra-ui/react"
import type { NextPage } from "next"
import Head from "next/head"
import { AppBar } from "../components/AppBar"
import { GuideList } from "../components/GuideList"
import { Form } from "../components/Form"
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
    return (
        <div className={styles.App}>
            <Head>
                <title>Guide Reviews</title>
            </Head>
            <AppBar />
            <Center>
                <Box>
                    <Heading as="h1" size="l" color="white" ml={4} mt={8}>
                        Add a review
                    </Heading>
                    <Form />
                    <Heading as="h1" size="l" color="white" ml={4} mt={8}>
                        Existing Reviews
                    </Heading>
                    <GuideList />
                </Box>
            </Center>
        </div>
    )
}

export default Home
