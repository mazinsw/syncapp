import React, { Component } from 'react';
import { Keyboard, View } from 'react-native';
import { Container, Header, Body, Left, Button, Icon, Title, Form, Item, Input, Label, Text, Content, Right } from 'native-base';

// SQLite configuration
import SQLite from 'react-native-sqlite-storage';

// Library for events manipulation
import Events from '../utils/events';

/**
 * 
 * @class RegisterCustomerScreen
 * @extends Component
 * @description Represents the screen to register a customer.
 */
export default class RegisterCustomerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            code: ''
        };
    }

    /**
     * 
     * @method RegisterCustomerScreen#insert
     * @description Method that inserts in database a customer.
     */
    insert() {
        let props = this.props;
        let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
        db.executeSql('INSERT INTO customer(name, code) VALUES(?, ?);', [this.state.name, this.state.code]);
        Events.publish('RefreshCustomer');
        props.navigation.goBack();
    }

    errorCB(err) {
        console.error("SQLite3 Error: " + err);
    }

    openCB() {
        console.log("Database OPENED");
    }

    render() {
        let props = this.props;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Cadastrar</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel last>
                            <Label>Nome</Label>
                            <Input onChangeText={(name) => this.setState({ name })} />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Código</Label>
                            <Input onChangeText={(code) => this.setState({ code })} />
                        </Item>
                    </Form>
                    <View style={{ margin: 15 }}>
                        <Button
                            full
                            danger
                            onPress={
                                () => {
                                    Keyboard.dismiss();
                                    this.insert();
                                    props.navigation.goBack();

                                }
                            }
                        >
                            <Text>Cadastrar</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}