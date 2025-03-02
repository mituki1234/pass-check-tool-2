const wo_list = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

self.onmessage = function(e) {
  const { target, startLength } = e.data;
  let know_pass = Array(startLength).fill(0);
  let iterationCount = 0;
  
  while (know_pass.length <= 12) {
    iterationCount++;
    const attempt = know_pass.map(index => wo_list[index]).join("");
    
    if (attempt === target) {
      self.postMessage({ found: true, password: attempt });
      return;
    }

    let pos = know_pass.length - 1;
    while (pos >= 0 && know_pass[pos] === wo_list.length - 1) {
      know_pass[pos] = 0;
      pos--;
    }
    if (pos < 0) {
      if (know_pass.length >= 12) break; // 12桁に達したら終了
      know_pass = Array(know_pass.length + 1).fill(0);
    } else {
      know_pass[pos]++;
    }

    // 進捗報告の頻度を調整
    if (iterationCount % 5000000 === 0) {
      self.postMessage({ 
        found: false, 
        current: attempt,
        length: know_pass.length
      });
    }
  }
  
  // 探索完了を報告
  self.postMessage({ 
    found: false, 
    current: "探索完了",
    completed: true 
  });
};
