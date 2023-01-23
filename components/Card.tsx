import { Box, HStack, Spacer, Stack, Text } from "@chakra-ui/react"
import { FC } from "react"
import { Guide } from "../models/Guide"

export interface CardProps {
    guide: Guide
    onClick: () => void
}

export const Card: FC<CardProps> = (props) => {
    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            borderWidth={1}
            margin={2}
            _hover={{
                background: "gray.900",
            }}
            onClick={props.onClick}
        >
            <Stack
                w="full"
                align={{ base: "center", md: "stretch" }}
                textAlign={{ base: "center", md: "left" }}
                mt={{ base: 4, md: 0 }}
                ml={{ md: 6 }}
                mr={{ md: 6 }}
            >
                <HStack>
                    <Text
                        fontWeight="bold"
                        textTransform="uppercase"
                        fontSize="lg"
                        letterSpacing="wide"
                        color="gray.200"
                    >
                        {props.guide.name}
                    </Text>
                    <Spacer />
                    <Text color="gray.200">{props.guide.rating}/5</Text>
                </HStack>
                <Text my={2} color="gray.400">
                    {props.guide.description}
                </Text>
            </Stack>
        </Box>
    )
}
