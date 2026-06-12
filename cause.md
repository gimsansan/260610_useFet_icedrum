```js
  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        setLoading(true);
        const res = isMockUrl(requestUrl)
          ? await mockFetch(requestUrl)
          : await fetch(requestUrl);
        if (!res.ok) {
          throw new Error("요청 실패", { cause: `HTTP ${res.status}` });
        }
        const json = await res.json();

        logSetState("setItems / setError(null)", cancelled);
        if (!cancelled) {
          setItems(json);
          setError(null);
        }
      } catch (err) {
        console.log("message:", err.message, "cause:", err.cause);  
        const errorText = String(err.cause ?? err.message);
    
        logSetState(`setError("${errorText}")`, cancelled);
        // err.message = 개발자용, err.cause = 화면/UI용
        if (!cancelled) setError(errorText);
      } finally {
        logSetState("setLoading(false)", cancelled);
        if (!cancelled) setLoading(false);
      }
    }
```


```js
 useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        setLoading(true);
        const res = isMockUrl(requestUrl)
          ? await mockFetch(requestUrl)
          : await fetch(requestUrl);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();

        logSetState("setItems / setError(null)", cancelled);
        if (!cancelled) {
          setItems(json);
          setError(null);
        }
      } catch (err) {
        console.log(err.message);
        const errorText = String(err.cause ?? err.message);

        logSetState(`setError("${errorText}")`, cancelled);
        // err.message = 개발자용, err.cause = 화면/UI용
        if (!cancelled) setError(errorText);
      } finally {
        logSetState("setLoading(false)", cancelled);
        if (!cancelled) setLoading(false);
      }
    }

```