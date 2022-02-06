import httpClient from '../httpClient'

// Mock out all top level functions, such as get, put, delete and post:
jest.mock('axios')

test('httpClient headers', () => {
    expect(httpClient.defaults.headers.get).toBeDefined()
    expect(httpClient.defaults.headers.post).toBeDefined()
})

test('httpClient get successfully', () => {
    httpClient.get.mockImplementation(() =>
        Promise.resolve({ data: { foo: 'bar' } })
    )
    httpClient.get('dummy/path').then((response) => {
        expect(response.data.foo).toBe('bar')
    })
})
