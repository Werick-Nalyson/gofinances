import React, { useState } from 'react'
import { Modal } from 'react-native'

import { Container, Header, Title, Form, Fields, TransactionsTypes } from './styles'
import { Button } from '../../components/Forms/Button'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'
import { CategorySelect } from '../CategorySelect'
import { useForm } from 'react-hook-form'
import { InputForm } from '../../components/Forms/InputForm'

interface FormData {
    name: string;
    amount: string;
}

export function Register () {
    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [category, setCategory] = useState({
        key: '',
        name: '',
    })

    const {
        control,
        handleSubmit
    } = useForm<FormData>()

    function handleTransactionTypeSelected (type: 'up' | 'down') {
        setTransactionType(type)
    }

    function handleCloseSelectCategory () {
        setCategoryModalOpen(false)
    }

    function handleOpenSelectCategoryModal () {
        setCategoryModalOpen(true)
    }

    function handleRegister (form: FormData) {
        console.log(form)
    }

    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <InputForm
                        control={control}
                        name="name"
                        placeholder="Nome"
                    />
                    
                    <InputForm
                        control={control}
                        name="amount"
                        placeholder="Preço"
                    />

                    <TransactionsTypes>
                        <TransactionTypeButton 
                            title="Income"
                            type="up"
                            onPress={() => handleTransactionTypeSelected('up')}
                            isActive={transactionType === 'up'}
                        />
                        <TransactionTypeButton 
                            title="Outcome"
                            type="down"
                            onPress={() => handleTransactionTypeSelected('down')}
                            isActive={transactionType === 'down'}
                        />
                    </TransactionsTypes>

                    <CategorySelectButton 
                        title={category.name || 'Categoria'}
                        onPress={() => handleOpenSelectCategoryModal()}
                    />
                </Fields>
                
                <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategory}
                />
            </Modal>

        </Container>
    )
}