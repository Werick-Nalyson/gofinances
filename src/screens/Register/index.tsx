import React, { useEffect, useState } from 'react'
import {
    Alert,
    Keyboard,
    Modal,
    TouchableWithoutFeedback
} from 'react-native'
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native'

import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import AsyncStorage from '@react-native-async-storage/async-storage'

import uuid from 'react-native-uuid'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles'

import { CategorySelect } from '../CategorySelect'

import { InputForm } from '../../components/Forms/InputForm'
import { Button } from '../../components/Forms/Button'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'

interface FormData {
    name: string;
    amount: string;
}


const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome e obrigatorio'),
    amount: Yup
    .number()
    .typeError('Informe um valor numerico')
    .positive('O valor nao pode ser negativo')
    .required('O valor e obrigatorio')
})

const dataKey = "@gofinances:transactions"

export function Register () {
    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [category, setCategory] = useState({
        key: '',
        name: '',
    })

    const navigation: NavigationProp<ParamListBase> = useNavigation()

    const {
        control,
        handleSubmit,
        reset,
        formState: {
            errors,
        }
    } = useForm<FormData>({
        resolver: yupResolver(schema)
    })

    function handleTransactionTypeSelected (type: 'up' | 'down') {
        setTransactionType(type)
    }

    function handleCloseSelectCategory () {
        setCategoryModalOpen(false)
    }

    function handleOpenSelectCategoryModal () {
        setCategoryModalOpen(true)
    }

    function resetFormValues () {
        reset()
        setTransactionType('')
        setCategory({
            key: '',
            name: '',
        })
    }

    async function handleRegister (form: FormData) {
        if (!transactionType)
            return Alert.alert('Selecione o tipo de transaçao.')

        if (!category.key)
            return Alert.alert('Selecione a categoria.')
        
        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            console.log(dataFormatted)

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            resetFormValues()
            navigation.navigate("Listagem")
        } catch (err) {
            console.log(err)
            Alert.alert("Não foi possível salvar")
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                        autoCapitalize='sentences'
                        autoCorrect={false}
                        error={errors.name?.message}
                    />
                    
                    <InputForm
                        control={control}
                        name="amount"
                        placeholder="Preço"
                        keyboardType='numeric'
                        error={errors.amount?.message}
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
        </TouchableWithoutFeedback>
    )
}