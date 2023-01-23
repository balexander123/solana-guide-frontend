import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  FormControl,
} from "@chakra-ui/react"
import { FC, useState } from "react"
import { Guide } from "../models/Guide"
import { CommentList } from "./CommentList"
import { Comment } from "../models/Comment"
import * as web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { GUIDE_REVIEW_PROGRAM_ID } from "../utils/constants"
import { CommentCoordinator } from "../coordinators/CommentCoordinator"

interface ReviewDetailProps {
  isOpen: boolean
  onClose: any
  guide: Guide
}

export const ReviewDetail: FC<ReviewDetailProps> = ({
  isOpen,
  onClose,
  guide,
}: ReviewDetailProps) => {
  const [comment, setComment] = useState("")
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleSubmit = (event: any) => {
    event.preventDefault()

    if (!publicKey) {
      alert("Please connect your wallet!")
      return
    }

    guide
      .publicKey()
      .then(async (review) => {
        await CommentCoordinator.syncCommentCount(connection, review)
        return review
      })
      .then((review) => {
        const c = new Comment(
          review,
          publicKey,
          comment,
          CommentCoordinator.commentCount
        )
        handleTransactionSubmit(c)
      })
  }

  const handleTransactionSubmit = async (comment: Comment) => {
    if (!publicKey) {
      return
    }

    const buffer = comment.serialize()
    const transaction = new web3.Transaction()

    const pda = await comment.publicKey()
    const counter = await CommentCoordinator.commentCounterPubkey(
      comment.review
    )
    const account = await connection.getAccountInfo(counter)

    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: comment.review,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: counter,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new web3.PublicKey(GUIDE_REVIEW_PROGRAM_ID),
    })

    transaction.add(instruction)

    try {
      let txid = await sendTransaction(transaction, connection)
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
    } catch (e) {
      console.log(JSON.stringify(e))
      alert(JSON.stringify(e))
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textTransform="uppercase"
            textAlign={{ base: "center", md: "center" }}
          >
            {guide.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack textAlign={{ base: "center", md: "center" }}>
              <p>{guide.description}</p>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <Input
                    id="title"
                    color="black"
                    onChange={(event) => setComment(event.currentTarget.value)}
                    placeholder="Submit a comment..."
                  />
                </FormControl>
                <Button width="full" mt={4} type="submit">
                  Send
                </Button>
              </form>
              <CommentList guide={guide} />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
